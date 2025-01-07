import sqlite3
import random
import string

# Connect to SQLite database
conn = sqlite3.connect('webdev.sqlite')
cursor = conn.cursor()

# Function to generate a random string (for venue names)
def generate_random_string(length=10):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

# Function to create random venues
def create_random_venues(num_venues=5):
    venue_ids = []
    for _ in range(num_venues):
        name = generate_random_string()
        capacity = random.randint(50, 500)  # Random capacity between 50 and 500
        cursor.execute("INSERT INTO Venue (Name, Capacity) VALUES (?, ?)", (name, capacity))
        venue_ids.append(cursor.lastrowid)
    conn.commit()
    return venue_ids

# Function to update TheatreShows with random venue IDs
def update_theatre_shows_with_random_venues(venue_ids):
    cursor.execute("SELECT TheatreShowId FROM TheatreShow")
    theatre_show_ids = cursor.fetchall()

    for show_id in theatre_show_ids:
        random_venue_id = random.choice(venue_ids)
        cursor.execute("UPDATE TheatreShow SET VenueId = ? WHERE TheatreShowId = ?", (random_venue_id, show_id[0]))
    
    conn.commit()

# Step 1: Create 5 random venues
venue_ids = create_random_venues(5)

# Step 2: Update all TheatreShows with a random VenueId
update_theatre_shows_with_random_venues(venue_ids)

print("Random venues created and TheatreShows updated with random venue IDs.")

# Close the connection
conn.close()
