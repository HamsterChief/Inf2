import sqlite3
import random
from faker import Faker
from datetime import datetime
import string

# Create an instance of Faker
fake = Faker()

# Connect to SQLite database
conn = sqlite3.connect('webdev.sqlite')
cursor = conn.cursor()

# Function to generate a random string (for venue names)


def generate_random_string(length=10):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def generate_future_date():
    return fake.date_this_year(after_today=True)


theater_shows = [
    ("Unleash Customized Users", "Glass ever over half military use agent. Also everything including remain region hear herself. Network daughter reflect card space example.", 44.13, [
        generate_future_date(), generate_future_date()
    ]),
    ("E-Enable Seamless Systems", "Oil money my owner house. Wish turn so book mention off.", 63.22, [
        generate_future_date(), generate_future_date(
        ), generate_future_date(), generate_future_date()
    ]),
    ("Revolutionize Extensible Infrastructures", "Above meet popular parent become necessary. Yard shoulder cover today list drop sea. Long smile see mind young.", 68.37, [
        generate_future_date(), generate_future_date()
    ]),
    ("Maximize Back-End Interfaces", "Prevent keep pressure dark style moment increase.", 39.87, [
        generate_future_date(), generate_future_date()
    ]),
    ("Syndicate One-To-One Methodologies", "Site shake everything building. Unit business eye. Night back try tax material enter.", 83.36, [
        generate_future_date(), generate_future_date()
    ]),
    ("Integrate Seamless Metrics", "By assume test offer control catch commercial just.", 58.21, [
        generate_future_date()
    ]),
    ("Grow Frictionless Schemas", "Raise onto board probably. Hospital moment together side pretty.", 35.55, [
        generate_future_date()
    ])
]

# Insert the theater shows into the database
for title, description, price, dates in theater_shows:
    # Insert into TheatreShow table
    cursor.execute("""
        INSERT INTO TheatreShow (Title, Description, Price) 
        VALUES (?, ?, ?)
    """, (title, description, price))
    show_id = cursor.lastrowid  # Get the last inserted TheatreShow ID

    # Insert the dates into TheatreShowDate table
    for date in dates:
        cursor.execute("""
            INSERT INTO TheatreShowDate (TheatreShowId, DateAndTime) 
            VALUES (?, ?)
        """, (show_id, date))

# Function to create random venues


def create_random_venues(num_venues=5):
    venue_ids = []
    for _ in range(num_venues):
        name = generate_random_string()
        # Random capacity between 50 and 500
        capacity = random.randint(50, 500)
        cursor.execute(
            "INSERT INTO Venue (Name, Capacity) VALUES (?, ?)", (name, capacity))
        venue_ids.append(cursor.lastrowid)
    conn.commit()
    return venue_ids

# Function to update TheatreShows with random venue IDs


def update_theatre_shows_with_random_venues(venue_ids):
    cursor.execute("SELECT TheatreShowId FROM TheatreShow")
    theatre_show_ids = cursor.fetchall()

    for show_id in theatre_show_ids:
        random_venue_id = random.choice(venue_ids)
        cursor.execute("UPDATE TheatreShow SET VenueId = ? WHERE TheatreShowId = ?",
                       (random_venue_id, show_id[0]))

    conn.commit()


# Step 1: Create 5 random venues
venue_ids = create_random_venues(5)

# Step 2: Update all TheatreShows with a random VenueId
update_theatre_shows_with_random_venues(venue_ids)

print("Random venues created and TheatreShows updated with random venue IDs.")

# Close the connection
conn.close()
