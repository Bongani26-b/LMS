-- ==============================================================================
-- SOUTH AFRICAN CAPS CURRICULUM SEED DATA (GRADES 8-12)
-- Real secondary school curriculum standards, subjects, and topics
-- ==============================================================================

-- 1. Insert Curriculum
INSERT INTO public.curricula (id, code, name, description, country, version, is_active)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'CAPS',
  'Curriculum and Assessment Policy Statement (CAPS)',
  'Official National Curriculum Statement for South African Secondary Schools (Grades 8-12)',
  'South Africa',
  '2026.1',
  true
) ON CONFLICT (code) DO NOTHING;

-- 2. Insert Academic Year & Terms for 2026
INSERT INTO public.academic_years (id, name, is_current, start_date, end_date)
VALUES (
  'b1b2c3d4-0000-0000-0000-000000000001',
  '2026',
  true,
  '2026-01-14',
  '2026-12-04'
) ON CONFLICT (name) DO NOTHING;

INSERT INTO public.terms (id, academic_year_id, term_number, name, start_date, end_date)
VALUES
  ('c1b2c3d4-0000-0000-0000-000000000001', 'b1b2c3d4-0000-0000-0000-000000000001', 1, 'Term 1', '2026-01-14', '2026-03-27'),
  ('c1b2c3d4-0000-0000-0000-000000000002', 'b1b2c3d4-0000-0000-0000-000000000001', 2, 'Term 2', '2026-04-08', '2026-06-26'),
  ('c1b2c3d4-0000-0000-0000-000000000003', 'b1b2c3d4-0000-0000-0000-000000000001', 3, 'Term 3', '2026-07-21', '2026-10-02'),
  ('c1b2c3d4-0000-0000-0000-000000000004', 'b1b2c3d4-0000-0000-0000-000000000001', 4, 'Term 4', '2026-10-13', '2026-12-04')
ON CONFLICT (academic_year_id, term_number) DO NOTHING;

-- 3. Insert Grades
INSERT INTO public.grades (id, code, name, phase, sequence_order)
VALUES
  ('d1b2c3d4-0000-0000-0000-000000000008', 'grade-8', 'Grade 8', 'Senior Phase', 8),
  ('d1b2c3d4-0000-0000-0000-000000000009', 'grade-9', 'Grade 9', 'Senior Phase', 9),
  ('d1b2c3d4-0000-0000-0000-000000000010', 'grade-10', 'Grade 10', 'FET Phase', 10),
  ('d1b2c3d4-0000-0000-0000-000000000011', 'grade-11', 'Grade 11', 'FET Phase', 11),
  ('d1b2c3d4-0000-0000-0000-000000000012', 'grade-12', 'Grade 12', 'FET Phase', 12)
ON CONFLICT (code) DO NOTHING;

-- 4. Insert Verified Public Secondary Schools
INSERT INTO public.schools (id, name, ems_code, province, district, status, contact_email, contact_phone, address)
VALUES
  ('e1b2c3d4-0000-0000-0000-000000000001', 'Pretoria Boys High School', 'ZA-GP-00124', 'Gauteng', 'Tshwane South', 'active', 'admin@boyshigh.com', '+27 12 600 0000', '251 Roper St, Brooklyn, Pretoria'),
  ('e1b2c3d4-0000-0000-0000-000000000002', 'Westerford High School', 'ZA-WC-00512', 'Western Cape', 'Metro Central', 'active', 'office@westerford.co.za', '+27 21 689 9154', 'Main Road, Rondebosch, Cape Town'),
  ('e1b2c3d4-0000-0000-0000-000000000003', 'Durban High School', 'ZA-KZN-00389', 'KwaZulu-Natal', 'Umlazi', 'active', 'contact@dhs.co.za', '+27 31 277 1500', '255 St Thomas Rd, Musgrave, Durban'),
  ('e1b2c3d4-0000-0000-0000-000000000004', 'Parktown High School for Girls', 'ZA-GP-00781', 'Gauteng', 'Johannesburg East', 'active', 'info@parktowngirls.co.za', '+27 11 593 5900', '55 Tyrone Ave, Parkview, Johannesburg'),
  ('e1b2c3d4-0000-0000-0000-000000000005', 'Grey High School', 'ZA-EC-00912', 'Eastern Cape', 'Nelson Mandela Bay', 'active', 'reception@greyhighschool.com', '+27 41 373 1300', 'College Drive, Mill Park, Gqeberha')
ON CONFLICT (ems_code) DO NOTHING;

-- 5. Insert Core Subjects (Grades 8 - 12)
-- Grade 8 Subjects
INSERT INTO public.subjects (id, curriculum_id, grade_id, code, name, category, description, icon, color)
VALUES
  ('f1b2c3d4-0008-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000008', 'MATH-8', 'Mathematics', 'Mathematical Sciences', 'Numbers, operations, algebra, geometry, and data handling.', 'Calculator', '#2563eb'),
  ('f1b2c3d4-0008-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000008', 'NSCI-8', 'Natural Sciences', 'Natural Sciences', 'Life and living, matter and materials, energy and change, planet Earth and beyond.', 'Atom', '#059669'),
  ('f1b2c3d4-0008-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000008', 'ENHL-8', 'English Home Language', 'Languages', 'Listening and speaking, reading and viewing, writing and presenting, language structures.', 'BookOpen', '#7c3aed'),
  ('f1b2c3d4-0008-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000008', 'EMSC-8', 'Economic & Management Sciences', 'Business, Commerce and Management', 'The economy, financial literacy, and entrepreneurship.', 'TrendingUp', '#d97706'),
  ('f1b2c3d4-0008-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000008', 'TECH-8', 'Technology', 'Technology', 'Design process, structures, processing, systems and control.', 'Cpu', '#dc2626')
ON CONFLICT (curriculum_id, grade_id, code) DO NOTHING;

-- Grade 10 Subjects (FET Phase)
INSERT INTO public.subjects (id, curriculum_id, grade_id, code, name, category, description, icon, color)
VALUES
  ('f1b2c3d4-0010-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'MATH-10', 'Mathematics', 'Mathematical Sciences', 'Algebraic expressions, functions, trigonometry, Euclidean geometry, analytical geometry, and statistics.', 'Calculator', '#2563eb'),
  ('f1b2c3d4-0010-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'MLIT-10', 'Mathematical Literacy', 'Mathematical Sciences', 'Finance, measurement, maps, plans, and representations of the physical world.', 'PieChart', '#0284c7'),
  ('f1b2c3d4-0010-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'PHSC-10', 'Physical Sciences', 'Natural Sciences', 'Mechanics, waves, sound and light, electricity and magnetism, matter and materials, chemical change.', 'Zap', '#059669'),
  ('f1b2c3d4-0010-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'LFSC-10', 'Life Sciences', 'Natural Sciences', 'Molecules to cells, plant and animal tissues, organs, support and transport systems, biosphere to ecosystems.', 'Dna', '#10b981'),
  ('f1b2c3d4-0010-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'ENHL-10', 'English Home Language', 'Languages', 'Critical language awareness, literature analysis, creative and transactional writing, and oral communication.', 'BookOpen', '#7c3aed'),
  ('f1b2c3d4-0010-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'ACCT-10', 'Accounting', 'Business, Commerce and Management', 'Financial accounting, managerial accounting, and managing resources.', 'Briefcase', '#d97706'),
  ('f1b2c3d4-0010-0000-0000-000000000007', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'INFT-10', 'Information Technology', 'Technology', 'Algorithms, object-oriented programming, data structures, and database management.', 'Code', '#4f46e5'),
  ('f1b2c3d4-0010-0000-0000-000000000008', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000010', 'GEOG-10', 'Geography', 'Humanities and Social Sciences', 'Climatology, geomorphology, population, and water resources.', 'Globe', '#0891b2')
ON CONFLICT (curriculum_id, grade_id, code) DO NOTHING;

-- Grade 11 & 12 Subjects (FET Phase)
INSERT INTO public.subjects (id, curriculum_id, grade_id, code, name, category, description, icon, color)
VALUES
  ('f1b2c3d4-0012-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000012', 'MATH-12', 'Mathematics', 'Mathematical Sciences', 'Calculus, sequences and series, polynomials, trigonometry, Euclidean geometry, probability.', 'Calculator', '#2563eb'),
  ('f1b2c3d4-0012-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000012', 'PHSC-12', 'Physical Sciences', 'Natural Sciences', 'Momentum, Newton laws, electrodynamics, optical phenomena, organic chemistry, rate of reactions, chemical equilibrium.', 'Zap', '#059669'),
  ('f1b2c3d4-0012-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000012', 'LFSC-12', 'Life Sciences', 'Natural Sciences', 'DNA, code of life, genetics and inheritance, responding to the environment, human endocrine system, evolution.', 'Dna', '#10b981'),
  ('f1b2c3d4-0012-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 'd1b2c3d4-0000-0000-0000-000000000012', 'ENHL-12', 'English Home Language', 'Languages', 'Advanced literary study, poetry, drama, transactional writing, critical comprehension.', 'BookOpen', '#7c3aed')
ON CONFLICT (curriculum_id, grade_id, code) DO NOTHING;

-- 6. Insert Topics for Grade 10 Physical Sciences (Aligned with Term 1 & 2 CAPS)
INSERT INTO public.topics (id, subject_id, term_id, title, description, sequence_order, estimated_hours)
VALUES
  ('a0b1c2d3-0001-0000-0000-000000000001', 'f1b2c3d4-0010-0000-0000-000000000003', 'c1b2c3d4-0000-0000-0000-000000000001', 'Matter and Materials: Kinetic Theory of Matter', 'States of matter, kinetic molecular theory, phase changes, and heating/cooling curves.', 1, 8),
  ('a0b1c2d3-0001-0000-0000-000000000002', 'f1b2c3d4-0010-0000-0000-000000000003', 'c1b2c3d4-0000-0000-0000-000000000001', 'Atomic Structure and the Periodic Table', 'Subatomic particles, atomic number, mass number, isotopes, electron configuration (Aufbau principle).', 2, 10),
  ('a0b1c2d3-0001-0000-0000-000000000003', 'f1b2c3d4-0010-0000-0000-000000000003', 'c1b2c3d4-0000-0000-0000-000000000001', 'Chemical Bonding', 'Covalent, ionic, and metallic bonding; Lewis structures and electronegativity differences.', 3, 10),
  ('a0b1c2d3-0001-0000-0000-000000000004', 'f1b2c3d4-0010-0000-0000-000000000003', 'c1b2c3d4-0000-0000-0000-000000000002', 'Mechanics: Motion in One Dimension', 'Position, displacement, speed, velocity, acceleration, and equations of motion.', 4, 12)
ON CONFLICT DO NOTHING;

-- 7. Insert Topics for Grade 10 Mathematics
INSERT INTO public.topics (id, subject_id, term_id, title, description, sequence_order, estimated_hours)
VALUES
  ('b0b1c2d3-0001-0000-0000-000000000001', 'f1b2c3d4-0010-0000-0000-000000000001', 'c1b2c3d4-0000-0000-0000-000000000001', 'Algebraic Expressions & Factorisation', 'Multiplying polynomials, factorising trinomials, grouping, difference of squares, and algebraic fractions.', 1, 10),
  ('b0b1c2d3-0001-0000-0000-000000000002', 'f1b2c3d4-0010-0000-0000-000000000001', 'c1b2c3d4-0000-0000-0000-000000000001', 'Equations & Inequalities', 'Linear equations, quadratic equations, simultaneous equations, and literal equations.', 2, 12),
  ('b0b1c2d3-0001-0000-0000-000000000003', 'f1b2c3d4-0010-0000-0000-000000000001', 'c1b2c3d4-0000-0000-0000-000000000002', 'Trigonometry', 'Definitions of sin, cos, tan in right-angled triangles; special angles (30, 45, 60 degrees); solving 2D problems.', 3, 14)
ON CONFLICT DO NOTHING;

-- 8. Enable default school subject offerings
INSERT INTO public.school_subject_offerings (school_id, subject_id, academic_year_id, is_offered)
SELECT s.id, subj.id, 'b1b2c3d4-0000-0000-0000-000000000001', true
FROM public.schools s
CROSS JOIN public.subjects subj
ON CONFLICT (school_id, subject_id, academic_year_id) DO NOTHING;

