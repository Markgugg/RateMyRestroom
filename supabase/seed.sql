-- Seed ~25 US schools
insert into public.schools (name, slug, city, state, domain) values
  ('Massachusetts Institute of Technology', 'mit', 'Cambridge', 'MA', 'mit.edu'),
  ('Stanford University', 'stanford', 'Stanford', 'CA', 'stanford.edu'),
  ('Harvard University', 'harvard', 'Cambridge', 'MA', 'harvard.edu'),
  ('University of California Berkeley', 'uc-berkeley', 'Berkeley', 'CA', 'berkeley.edu'),
  ('University of Michigan', 'umich', 'Ann Arbor', 'MI', 'umich.edu'),
  ('New York University', 'nyu', 'New York', 'NY', 'nyu.edu'),
  ('University of Texas at Austin', 'ut-austin', 'Austin', 'TX', 'utexas.edu'),
  ('University of Florida', 'uf', 'Gainesville', 'FL', 'ufl.edu'),
  ('Penn State University', 'penn-state', 'State College', 'PA', 'psu.edu'),
  ('Ohio State University', 'ohio-state', 'Columbus', 'OH', 'osu.edu'),
  ('University of Illinois Urbana-Champaign', 'uiuc', 'Champaign', 'IL', 'illinois.edu'),
  ('University of Wisconsin-Madison', 'uw-madison', 'Madison', 'WI', 'wisc.edu'),
  ('UCLA', 'ucla', 'Los Angeles', 'CA', 'ucla.edu'),
  ('University of Washington', 'uw', 'Seattle', 'WA', 'uw.edu'),
  ('Georgia Tech', 'georgia-tech', 'Atlanta', 'GA', 'gatech.edu'),
  ('Carnegie Mellon University', 'cmu', 'Pittsburgh', 'PA', 'cmu.edu'),
  ('Cornell University', 'cornell', 'Ithaca', 'NY', 'cornell.edu'),
  ('Columbia University', 'columbia', 'New York', 'NY', 'columbia.edu'),
  ('University of Chicago', 'uchicago', 'Chicago', 'IL', 'uchicago.edu'),
  ('Yale University', 'yale', 'New Haven', 'CT', 'yale.edu'),
  ('Princeton University', 'princeton', 'Princeton', 'NJ', 'princeton.edu'),
  ('Duke University', 'duke', 'Durham', 'NC', 'duke.edu'),
  ('Vanderbilt University', 'vanderbilt', 'Nashville', 'TN', 'vanderbilt.edu'),
  ('Boston University', 'bu', 'Boston', 'MA', 'bu.edu'),
  ('Purdue University', 'purdue', 'West Lafayette', 'IN', 'purdue.edu');

-- Seed a few restrooms for MIT and Stanford
insert into public.restrooms (school_id, building, floor, gender, description)
select id, 'Building 7 (Lobby)', '1st Floor', 'all-gender', 'Near the main entrance. Usually well-stocked.'
from public.schools where slug = 'mit';

insert into public.restrooms (school_id, building, floor, gender, description)
select id, 'Student Center (W20)', '2nd Floor', 'women', 'Spacious, good lighting.'
from public.schools where slug = 'mit';

insert into public.restrooms (school_id, building, floor, gender, description)
select id, 'Infinite Corridor (Building 10)', '1st Floor', 'men', 'Busy but well-maintained.'
from public.schools where slug = 'mit';

insert into public.restrooms (school_id, building, floor, gender, description)
select id, 'Green Library', '1st Floor', 'all-gender', 'Quiet area, very clean.'
from public.schools where slug = 'stanford';

insert into public.restrooms (school_id, building, floor, gender, description)
select id, 'Memorial Auditorium', 'Basement', 'women', 'Often crowded during events.'
from public.schools where slug = 'stanford';

insert into public.restrooms (school_id, building, floor, gender, description)
select id, 'Gates Computer Science', '2nd Floor', 'men', 'Modern, well-kept.'
from public.schools where slug = 'stanford';
