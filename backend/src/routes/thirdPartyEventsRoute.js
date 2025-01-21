const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { getDbPool } = require('../db');

// Helper functions from above
/**
 * Extract street address, city, state, and zip from the addressComponents array
 * (which has objects like { types: ["locality"], long_name: "Douglas", ... })
 */
function parseAddressComponents(components = []) {
    let streetNumber = '';
    let route = '';
    let city = '';
    let state = '';
    let zip = '';
  
    for (const c of components) {
      if (c.types.includes('street_number')) {
        streetNumber = c.long_name;
      }
      if (c.types.includes('route')) {
        route = c.long_name;
      }
      if (c.types.includes('locality')) {
        city = c.long_name;
      }
      if (c.types.includes('administrative_area_level_1')) {
        // This is typically the US state abbreviation like 'GA'
        state = c.short_name;
      }
      if (c.types.includes('postal_code')) {
        zip = c.long_name;
      }
    }
  
    const streetAddress = (streetNumber + ' ' + route).trim();
  
    return {
      streetAddress,
      city,
      state,
      zip
    };
  }
  
  /**
   * Convert an ISO date-time string (e.g. "2025-03-22T13:00:00.000Z")
   * into a "YYYY-MM-DD" date string.
   *
   * Note: This uses UTC fields; if you want local times, adjust accordingly.
   */
  function parseDate(isoString) {
    if (!isoString) return null;
    const d = new Date(isoString); // parsed as UTC by default in Node
  
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`; // e.g. "2025-03-22"
  }
  
  /**
   * Convert an ISO date-time string into an "HH:MM:SS" time string.
   *
   * Again, this is UTC-based. If you need local times, you’ll need different logic.
   */
  function parseTime(isoString) {
    if (!isoString) return null;
    const d = new Date(isoString);
  
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`; // e.g. "13:00:00"
  }
  
/**
 * Translate a single event item from the feed into your DB schema
 * that your "events" table expects.
 */
function translateEvent(item) {
    // address object might be undefined; default to empty object
    const address = item.address || {};
    const components = address.addressComponents || [];
  
    // Extract parts of the address
    const { streetAddress, city, state, zip } = parseAddressComponents(components);
    
    // Parse the feed's startTime/endTime into separate date/time
    const startDate = parseDate(item.startTime);
    const startTime = parseTime(item.startTime);
  
    const endDate = parseDate(item.endTime);
    const endTime = parseTime(item.endTime);
  
    // We'll store the cover image as the only image in an array
    // The feed calls it: item.cover?.source
    const coverImage = item.cover && item.cover.source ? [item.cover.source] : [];
  
    return {
      // Basic text fields
      eventName: item.name || '',  
      description: item.description || '',
      
      // Address
      streetAddress,
      city,
      state,
      zipCode: zip,
      latitude: address.lat || null,
      longitude: address.lng || null,
  
      // Date/time in separate columns
      startDate,   // "YYYY-MM-DD"
      startTime,   // "HH:MM:SS"
      endDate,     // "YYYY-MM-DD" or null
      endTime,     // "HH:MM:SS" or null
  
      // We don't see phone or email in the example feed, so set them to null
      phone: null,
      email: null,
  
      // Use "eventLink" or "ImGoingLink" or both for your website field. 
      // Just choose whichever you prefer as the link.
      website: item.eventLink || item.ImGoingLink || null,
  
      // We can store any custom category or social info in an array if you want
      socialPlatforms: [],
  
      // Use the cover image as the only image. If you want 'logo' to be null, do so:
      logoUrl: null,
      imageUrls: coverImage,
  
      // The feed's unique ID for this event
      threePid: item.id
    };
  }  

router.get('/pull-3rd-party-events', async (req, res) => {
  let client;
  try {
    // 1) Fetch the 3rd-party feed
    const response = await fetch('https://imgoing-prod-api.xyz/api/v2.0/DouglasGA/events?key=m9XKFUS8HwezBjo3nS3ERE5ZJVa9ke1voMawP6lD9k');
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch third party feed' });
    }
    const data = await response.json();
    const eventsArray = data.events || [];

    // 2) Connect to DB
    const pool = await getDbPool();
    client = await pool.connect();

    // 3) Insert or update each event
    for (const item of eventsArray) {
      const e = translateEvent(item);

      // Notice the columns must match your "events" schema exactly
      // Insert each field, then do ON CONFLICT (3pid).
      const query = `
        INSERT INTO events (
          name,
          street_address,
          city,
          state,
          zip,
          lat,
          long,
          start_date,
          start_time,
          end_date,
          end_time,
          description,
          phone,
          email,
          web,
          social_platforms,
          logo,
          images,
          "3pid"
        )
        VALUES ($1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15,
                $16, $17, $18, $19)
        ON CONFLICT ("3pid") DO UPDATE
          SET name = EXCLUDED.name,
              street_address = EXCLUDED.street_address,
              city = EXCLUDED.city,
              state = EXCLUDED.state,
              zip = EXCLUDED.zip,
              lat = EXCLUDED.lat,
              long = EXCLUDED.long,
              start_date = EXCLUDED.start_date,
              start_time = EXCLUDED.start_time,
              end_date = EXCLUDED.end_date,
              end_time = EXCLUDED.end_time,
              description = EXCLUDED.description,
              phone = EXCLUDED.phone,
              email = EXCLUDED.email,
              web = EXCLUDED.web,
              social_platforms = EXCLUDED.social_platforms,
              logo = EXCLUDED.logo,
              images = EXCLUDED.images
        RETURNING id
      `;

      const values = [
        e.eventName,
        e.streetAddress,
        e.city,
        e.state,
        e.zipCode,
        e.latitude,
        e.longitude,
        e.startDate,
        e.startTime,
        e.endDate,
        e.endTime,
        e.description,
        e.phone,
        e.email,
        e.website,
        JSON.stringify(e.socialPlatforms || []),
        e.logoUrl,
        e.imageUrls.length ? e.imageUrls : null,
        e.threePid
      ];

      await client.query(query, values);
    }

    res.status(200).json({
      message: `Upserted ${eventsArray.length} events from 3rd party feed`
    });
  } catch (error) {
    console.error('Error pulling 3rd-party events:', error);
    res.status(500).json({ error: 'Error pulling 3rd-party events' });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
