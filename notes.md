google calendar datetime format:

```
  "start": {
    "dateTime": "2024-02-17T10:00:00Z",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "2024-02-17T11:00:00Z",
    "timeZone": "America/New_York"
  },
```

.ics datetime format:

```
DTSTAMP:20240216T000000Z
DTSTART:20240217T100000Z
DTEND:20240217T110000Z
```

full google calendar api example:

```
{
  "kind": "calendar#event",
  "etag": "\"1234567890123456\"",
  "id": "eventID123",
  "status": "confirmed",
  "htmlLink": "https://www.google.com/calendar/event?eid=eventID123",
  "created": "2024-02-10T10:00:00.000Z",
  "updated": "2024-02-10T10:00:00.000Z",
  "summary": "Example Event Name",
  "description": "This is an example description of the event.",
  "location": "Example Location, 123 Example Street, City, Country",
  "start": {
    "dateTime": "2024-03-03T08:30:00Z",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "2024-03-03T10:00:00Z",
    "timeZone": "America/New_York"
  },
  "attendees": [
    {
      "email": "attendee1@example.com",
      "responseStatus": "accepted"
    },
    {
      "email": "attendee2@example.com",
      "responseStatus": "declined"
    }
  ],
  "organizer": {
    "email": "organizer@example.com",
    "displayName": "Organizer's Name"
  },
  "reminders": {
    "useDefault": false,
    "overrides": [
      {"method": "email", "minutes": 24 * 60},
      {"method": "popup", "minutes": 10}
    ]
  }
}
```

google calendar api example with overlapping events:

```{
  "kind": "calendar#events",
  "items": [
    {
      "kind": "calendar#event",
      "id": "1",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=1",
      "summary": "Morning Meeting",
      "description": "Discussing project updates.",
      "location": "Conference Room A",
      "start": {
        "dateTime": "2024-02-17T09:00:00-05:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2024-02-17T10:00:00-05:00",
        "timeZone": "America/New_York"
      }
    },
    {
      "kind": "calendar#event",
      "id": "2",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=2",
      "summary": "Client Call",
      "description": "Strategy call with key client.",
      "location": "Conference Call",
      "start": {
        "dateTime": "2024-02-17T09:30:00-05:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2024-02-17T10:30:00-05:00",
        "timeZone": "America/New_York"
      }
    },
    {
      "kind": "calendar#event",
      "id": "3",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=3",
      "summary": "Lunch Break",
      "description": "Team lunch at the local diner.",
      "location": "Diner",
      "start": {
        "dateTime": "2024-02-17T12:00:00-05:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2024-02-17T13:00:00-05:00",
        "timeZone": "America/New_York"
      }
    }
  ]
}
```

google calendar api example with overlapping events and more data:

```
{
  "kind": "calendar#events",
  "etag": "\"p3308dufaj34b0g\"",
  "summary": "example@gmail.com",
  "updated": "2024-03-10T12:00:00.000Z",
  "timeZone": "America/New_York",
  "accessRole": "owner",
  "items": [
    {
      "kind": "calendar#event",
      "etag": "\"3076006875686000\"",
      "id": "1",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=1",
      "created": "2024-01-01T08:00:00.000Z",
      "updated": "2024-01-10T10:00:00.000Z",
      "summary": "Morning Meeting",
      "description": "Discussing project updates with the team.",
      "location": "Conference Room A",
      "creator": {
        "email": "organizer@example.com",
        "displayName": "Organizer Name",
        "self": true
      },
      "organizer": {
        "email": "organizer@example.com",
        "displayName": "Organizer Name",
        "self": true
      },
      "start": {
        "dateTime": "2024-03-17T08:00:00-05:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2024-03-17T10:00:00-05:00",
        "timeZone": "America/New_York"
      },
      "visibility": "public",
      "attendees": [
        {
          "email": "attendee1@example.com",
          "displayName": "Attendee 1",
          "organizer": false,
          "responseStatus": "accepted"
        },
        {
          "email": "attendee2@example.com",
          "displayName": "Attendee 2",
          "organizer": false,
          "responseStatus": "tentative"
        }
      ],
      "reminders": {
        "useDefault": false,
        "overrides": [
          {"method": "email", "minutes": 24 * 60},
          {"method": "popup", "minutes": 30}
        ]
      }
    },
    {
      "kind": "calendar#event",
      "etag": "\"3076068371940000\"",
      "id": "2",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=2",
      "created": "2024-01-05T09:30:00.000Z",
      "updated": "2024-01-15T10:30:00.000Z",
      "summary": "Client Call",
      "description": "Strategy call with key client to discuss new proposals.",
      "location": "Conference Call",
      "creator": {
        "email": "organizer@example.com",
        "displayName": "Organizer Name",
        "self": true
      },
      "organizer": {
        "email": "organizer@example.com",
        "displayName": "Organizer Name",
        "self": true
      },
      "start": {
        "dateTime": "2024-03-17T09:30:00-05:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2024-03-17T10:30:00-05:00",
        "timeZone": "America/New_York"
      },
      "visibility": "private",
      "attendees": [
        {
          "email": "client@example.com",
          "displayName": "Client Name",
          "organizer": false,
          "responseStatus": "needsAction"
        }
      ],
      "reminders": {
        "useDefault": true
      }
    },
    {
      "kind": "calendar#event",
      "etag": "\"3076012378978000\"",
      "id": "3",
      "status": "confirmed",
      "htmlLink": "https://www.google.com/calendar/event?eid=3",
      "created": "2024-01-10T12:00:00.000Z",
      "updated": "2024-01-20T13:00:00.000Z",
      "summary": "Lunch Break",
      "description": "Team lunch at the local diner. A chance to relax and enjoy some informal time together.",
      "location": "Local Diner",
      "creator": {
        "email": "organizer@example.com",
        "displayName": "Organizer Name",
        "self": true
      },
      "organizer": {
        "email": "organizer@example.com",
        "displayName": "Organizer Name",
        "self": true
      },
      "start": {
        "dateTime": "2024-03-17T12:00:00-05:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2024-03-17T13:00:00-05:00",
        "timeZone": "America/New_York"
      },
      "visibility": "public",
      "attendees": [
        {
          "email": "team_member@example.com",
          "displayName": "Team Member",
          "organizer": false,
          "responseStatus": "accepted"
        }
      ],
      "reminders": {
        "useDefault": false,
        "overrides": [
          {"method": "popup", "minutes": 15}
        ]
      }
    }
  ]
}
```

```
// Define the end time
const lateEnd = Temporal.PlainTime.from("22:59:59");

// Get the current zoned date time
const now = Temporal.Now.zonedDateTimeISO();

// Extract the plain time from the current zoned date time
const nowTime = now.toPlainTime();

// Compare the current time with the late end time
const comparisonResult = Temporal.PlainTime.compare(nowTime, lateEnd);

// Check if the current time is before the late end time
if (comparisonResult === -1) {
    console.log('Now is before the late end time.');
} else if (comparisonResult === 0) {
    console.log('Now is exactly at the late end time.');
} else {
    console.log('Now is after the late end time.');
}

```
