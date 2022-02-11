**INITIATING**

Welcome to Time API, where you can administrate the availability of your time by frequency, days and time.

To start it, you will need Node installed on your machine and also Yarn. First, to install all the necessary packages, run:

`yarn`

Then, to run the API, run:

`yarn dev`

The API will run at localhost:3000.

****
**RUNNING**

The API has 4 endpoints. One to create a new rule, one to list all the rules, one to delete an existing rule and one to list all the available periods for the next 7 days.

**Creating a new rule**

```POST localhost:3000/availabilityRule```

There are 3 frequencies of rules: Once, Daily and Weekly. For all of them, you must inform the frequency and the intervals.

The last one is an array of objects containing start and end times, in the format HH:mm, but with the format H:mm if the hour is one digit long.

Like this:

```
{
	"frequency": "daily",
	"intervals": [
		{
			"end": "10:30",
			"start": "9:30"
		},
        {
			"end": "8:30",
			"start": "8:20"
		}
	]
}
```

If your new rule is a valid one, the answer will be with the exact object that you sent besides the uuid field. Like in this examples:

```
{
	"frequency": "daily",
	"intervals": [
		{
			"end": "10:30",
			"start": "9:30"
		},
        {
			"end": "8:30",
			"start": "8:20"
		}
	],
	"uuid": "3c89246c-96a6-4690-beb2-f2712323a2a9"
}
```

*"Can't"s*

You cannot create one rule whose interval overlaps another one. Example: if you create a daily rule that starts at 8:30 and ends at 9:30 you cannot create a new rule that starts at 8:45 and ends at 12:00, even with another frequency.

You cannot create a rule that starts after it ends, which means that you cannot create a interval with a start at 9:30 and with an end at 8:30.

*Once Rule*

An example of an Once rule is:

```
{
	"frequency": "once",
	"day": "2022-02-26",
	"intervals": [
		{
			"start": "9:30",
			"end": "10:30"
		},
        {
			"start": "11:30",
			"end": "12:30"
		}
	]
}
```

Since it will happen only once, you have to specify the day in the format YYYY-MM-DD.

*Daily Rule*

An example of a Daily rule is:

```
{
	"frequency": "daily",
	"intervals": [
		{
			"end": "10:30",
			"start": "9:30"
		},
        {
			"end": "8:30",
			"start": "8:20"
		}
	]
}
```

As the rule is daily, there is no need to specify any day. The system will just assume the period will be free everyday until you delete this rule.

*Weekly Rule*

An example of Weekly rule is:

```
{
	"frequency": "weekly",
	"weekdays": [
		"sun",
		"sat"
	],
	"intervals": [
		{
			"end": "10:30",
			"start": "9:30"
		}
	]
}
```

In order to create a weekly rule, you have to inform which weekdays you will be available, as an array of strings with its three initial letters.

**Listing all existing rules**

```GET localhost:3000/availabilityRule```

Returns all of the existing rules, example:

```
[
    {
        "frequency": "daily",
        "intervals": [
            {
                "end": "8:30",
                "start": "8:20"
            }
        ],
        "uuid": "3c89246c-96a6-4690-beb2-f2712323a2a9"
    },
    {
        "frequency": "weekly",
        "weekdays": [
            "sun",
            "sat"
        ],
        "intervals": [
            {
                "end": "10:30",
                "start": "9:30"
            }
        ],
        "uuid": "69baba3f-fe73-4309-b26e-af0317a83e12"
    }
]
```

**Deleting one existing rule**

```DELETE localhost:3000/availabilityRule/:uuid```

Delete one existing rule if it matches the uuid, example:

```DELETE localhost:3000/availabilityRule/69baba3f-fe73-4309-b26e-af0317a83e12```

This requisition would delete the following rule:

```
{
    "frequency": "weekly",
    "weekdays": [
        "sun",
        "sat"
    ],
    "intervals": [
        {
            "end": "10:30",
            "start": "9:30"
        }
    ],
    "uuid": "69baba3f-fe73-4309-b26e-af0317a83e12"
}
```

The expected return is 204. Any one response means that the deletion did not happen and it comes with its reason.

**Listing all available times in the next 7 days**

```GET localhost:3000/availableTime```

Based on the existing rules, the system calculate what days and periods you will be available and returns them nested by day. Example:

```[
  {
    "day": "2022-02-11",
    "intervals": [
      {
        "start": "10:40",
        "end": "10:50"
      },
      {
        "start": "09:30",
        "end": "10:30"
      }
    ]
  },
  {
    "day": "2022-02-07",
    "intervals": [
      {
        "start": "09:30",
        "end": "10:30"
      },
      {
        "start": "18:00",
        "end": "19:00"
      }
    ]
  },
  {
    "day": "2022-02-08",
    "intervals": [
      {
        "start": "09:30",
        "end": "10:30"
      },
      {
        "start": "18:00",
        "end": "19:00"
      }
    ]
  },
  {
    "day": "2022-02-09",
    "intervals": [
      {
        "start": "09:30",
        "end": "10:30"
      },
      {
        "start": "18:00",
        "end": "19:00"
      }
    ]
  },
  {
    "day": "2022-02-10",
    "intervals": [
      {
        "start": "09:30",
        "end": "10:30"
      },
      {
        "start": "18:00",
        "end": "19:00"
      }
    ]
  },
  {
    "day": "2022-02-12",
    "intervals": [
      {
        "start": "09:30",
        "end": "10:30"
      },
      {
        "start": "18:00",
        "end": "19:00"
      }
    ]
  },
  {
    "day": "2022-02-13",
    "intervals": [
      {
        "start": "09:30",
        "end": "10:30"
      },
      {
        "start": "18:00",
        "end": "19:00"
      }
    ]
  }
]
```