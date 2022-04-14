-- CREATE statements
CREATE TABLE genre(
    genreid serial PRIMARY KEY,
    description TEXT
);

CREATE TABLE movie (
    movieid serial PRIMARY KEY, 
    title TEXT NOT NULL, 
    year integer, 
    region TEXT,
    movgenreid integer REFERENCES genre(genreid),
    description TEXT,
    ratings integer, 
    photo text
);

CREATE TABLE actor (
    actorid serial PRIMARY KEY, 
    actfirstname TEXT, 
    actlastname TEXT, 
    actgender TEXT
);

CREATE TABLE movie_actor (
    movactid serial PRIMARY KEY, 
    movieid integer REFERENCES movie(movieid), 
    actorid integer REFERENCES actor(actorid)
);


-- INSERT statements
INSERT INTO genre (description) VALUES
    ('Action'),
    ('Comedy'),
    ('Romance'),
    ('Drama'),
    ('Thriller');

INSERT INTO movie (title, year, region, movgenreid, description, ratings) VALUES
    ('Turning Red', 2022, 'US', 1, 
    'The movie follows Mei-Mei, a 13-year-old girl who is all about that grind, vibing with her besties and obsessing over the teen heartthrob boy band 4-Town. 
    But she wakes up one morning finding herself the victim of the curse of the red panda, which means she turns into a red panda whenever she gets too emotional', 4),
    ('Game of Thrones Season 1', 2011, 'US', 1, 'Like the novel, the season initially focuses on the family of nobleman Eddard "Ned" Stark, the Warden of the North, who is asked to become the King Hand (chief advisor) to his longtime friend, King Robert Baratheon. Ned seeks to find out who murdered his predecessor, Jon Arryn', 5),
    ('Business Proposal', 2022, 'Korea', 2, 'A business proposal is an on-going K-drama directed by Park Sun-ho. Being a romantic comedy series, the story is all about a girl who goes on a blind date in disguise to reject the person but things take turn and a love interest blossom', 3),
    ('Squid Game', 2021, 'Korea', 3, 'The series revolves around Seong Gi-hun, a divorced and indebted chauffeur, who is invited to play a series of childrens games for a chance earning a large cash prize. When he accepts the offer, he is taken to an unknown location where he finds himself among 455 other players who are also deeply in debt', 2),
    ('Some Day One Day', 2019, 'Taiwan', 4, 'The plot involves a 27-year-old woman Huang Yu-Hsuan (Alice Ko), who longs to be able to see her deceased boyfriend Wang Quan-Sheng (Greg Hsu), who had died in an airplane accident. She misses him deeply and frequently sends him text messages, hoping that he will somehow be able to see', 3),
    ('Home Alone', 1990, 'US', 5, 'HOME ALONE is the story of 8-year-old Kevin (Macaulay Culkin), a mischievous middle child who feels largely ignored by his large extended family. While preparing for a Christmas vacation in Paris, Kevin gets in trouble, is banished to the attic overnight, and wishes his family would just disappear', 4),
    ('Sister Sister', 2019, 'Vietnam', 4, 'A late night radio talk show host offers a room to a runaway teen at her opulent home, what she does not bargain for is the eighteen year old has ulterior motives which forces Kim to face her darkest secrets', 5),
    ('Bridgerton', 2020, 'England', 1, 'Bridgerton follows Daphne Bridgerton (Phoebe Dynevor), the eldest daughter of the powerful Bridgerton family as she makes her debut onto Regency Londons competitive marriage market. Hoping to follow in her parents footsteps and find a match sparked by true love, Daphnes prospects initially seem to be unrivaled', 2),
    ('Forgotten', 2017, 'Korea', 2, 'FORGOTTEN is the story of two brothers, one of whom is kidnapped violently by persons unknown only to turn up, seemingly unharmed, some three weeks later. However, his brother is concerned by his siblings unusual behaviour, and the plot develops from there', 5),
    ('The Heirs', 2013, 'Korea', 3, '"The Heirs" depicts the friendships, rivalries and love lives of young, rich heirs led by Kim Tan (Lee Min-Ho) and a girl named Cha Eun-Sang (Park Shin-Hye). Unlike the others, Cha Eun-Sang is considered ordinary and comes from a poor background. 18-year-old Cha Eun-Sang lives with her mother who is mute', 4);

INSERT INTO actor (actfirstname, actlastname, actgender) VALUES
    ('Rosalie', 'Chiang', 'Female'),
    ('Channing', 'Tatum', 'Male'),
    ('Paul', 'Ahn', 'Male'),
    ('Haneul', 'Kang', 'Male'),
    ('Greg', 'Hsu', 'Male'),
    ('Chi', 'Pu', 'Female'),
    ('Macaulay', 'Culkin', 'Male'),
    ('Joe', 'Pesci', 'Male'),
    ('Phoebe', 'Dynevor', 'Female'),
    ('MinHo', 'Lee', 'Male'),
    ('Ji-cheol', 'Gong', 'Male'),
    ('Emilia', 'Clarke', 'Female');

INSERT INTO movie_actor (movieid, actorid) VALUES
    (1, 2),
    (2, 12),
    (3, 3),
    (4, 11),
    (5, 5),
    (6, 7),
    (7, 6),
    (8, 9),
    (9, 4),
    (10, 4);

