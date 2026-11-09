import {
  Curriculum,
  Grade,
  School,
  Subject,
  Topic,
  EducationalResource,
  Assessment,
  AssessmentQuestion,
} from '@/types';

export const INITIAL_CURRICULUM: Curriculum = {
  id: 'a1b2c3d4-0000-0000-0000-000000000001',
  code: 'CAPS',
  name: 'Curriculum and Assessment Policy Statement (CAPS)',
  description: 'Official National Curriculum Statement for South African Secondary Schools (Grades 8-12)',
  country: 'South Africa',
  version: '2026.1',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
};

export const INITIAL_GRADES: Grade[] = [
  {
    id: 'grade-8',
    code: 'grade-8',
    name: 'Grade 8',
    phase: 'Senior Phase',
    sequence_order: 8,
  },
  {
    id: 'grade-9',
    code: 'grade-9',
    name: 'Grade 9',
    phase: 'Senior Phase',
    sequence_order: 9,
  },
  {
    id: 'grade-10',
    code: 'grade-10',
    name: 'Grade 10',
    phase: 'FET Phase',
    sequence_order: 10,
  },
  {
    id: 'grade-11',
    code: 'grade-11',
    name: 'Grade 11',
    phase: 'FET Phase',
    sequence_order: 11,
  },
  {
    id: 'grade-12',
    code: 'grade-12',
    name: 'Grade 12',
    phase: 'FET Phase',
    sequence_order: 12,
  },
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-001',
    name: 'Pretoria Boys High School',
    ems_code: 'ZA-GP-00124',
    province: 'Gauteng',
    district: 'Tshwane South',
    status: 'active',
    contact_email: 'admissions@boyshigh.com',
    contact_phone: '+27 12 600 0000',
    address: '251 Roper St, Brooklyn, Pretoria, 0181',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sch-002',
    name: 'Westerford High School',
    ems_code: 'ZA-WC-00512',
    province: 'Western Cape',
    district: 'Metro Central',
    status: 'active',
    contact_email: 'office@westerford.co.za',
    contact_phone: '+27 21 689 9154',
    address: 'Main Road, Rondebosch, Cape Town, 7700',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sch-003',
    name: 'Durban High School',
    ems_code: 'ZA-KZN-00389',
    province: 'KwaZulu-Natal',
    district: 'Umlazi',
    status: 'active',
    contact_email: 'contact@dhs.co.za',
    contact_phone: '+27 31 277 1500',
    address: '255 St Thomas Rd, Musgrave, Durban, 4001',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sch-004',
    name: 'Parktown High School for Girls',
    ems_code: 'ZA-GP-00781',
    province: 'Gauteng',
    district: 'Johannesburg East',
    status: 'active',
    contact_email: 'info@parktowngirls.co.za',
    contact_phone: '+27 11 593 5900',
    address: '55 Tyrone Ave, Parkview, Johannesburg, 2193',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sch-005',
    name: 'Grey High School',
    ems_code: 'ZA-EC-00912',
    province: 'Eastern Cape',
    district: 'Nelson Mandela Bay',
    status: 'active',
    contact_email: 'reception@greyhighschool.com',
    contact_phone: '+27 41 373 1300',
    address: 'College Drive, Mill Park, Gqeberha, 6001',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  // Grade 8
  {
    id: 'subj-math-8',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-8',
    code: 'MATH-8',
    name: 'Mathematics',
    category: 'Mathematical Sciences',
    description: 'Whole numbers, integers, fractions, algebraic expressions, geometry, and measurements.',
    icon: 'Calculator',
    color: '#2563eb',
    is_active: true,
  },
  {
    id: 'subj-nsci-8',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-8',
    code: 'NSCI-8',
    name: 'Natural Sciences',
    category: 'Natural Sciences',
    description: 'Life and living, matter and materials, energy and change, planet Earth and beyond.',
    icon: 'Atom',
    color: '#059669',
    is_active: true,
  },
  {
    id: 'subj-enhl-8',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-8',
    code: 'ENHL-8',
    name: 'English Home Language',
    category: 'Languages',
    description: 'Listening and speaking, reading and viewing, writing and presenting, language conventions.',
    icon: 'BookOpen',
    color: '#7c3aed',
    is_active: true,
  },
  {
    id: 'subj-emsc-8',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-8',
    code: 'EMSC-8',
    name: 'Economic & Management Sciences',
    category: 'Business, Commerce and Management',
    description: 'The economy, financial literacy, accounting concepts, and entrepreneurship.',
    icon: 'TrendingUp',
    color: '#d97706',
    is_active: true,
  },
  {
    id: 'subj-tech-8',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-8',
    code: 'TECH-8',
    name: 'Technology',
    category: 'Technology',
    description: 'Technological design process, structures, mechanical systems, and processing.',
    icon: 'Cpu',
    color: '#dc2626',
    is_active: true,
  },

  // Grade 10 (FET Phase)
  {
    id: 'subj-math-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'MATH-10',
    name: 'Mathematics',
    category: 'Mathematical Sciences',
    description: 'Algebraic equations, functions, Euclidean geometry, analytical geometry, trigonometry, and statistics.',
    icon: 'Calculator',
    color: '#2563eb',
    is_active: true,
  },
  {
    id: 'subj-mlit-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'MLIT-10',
    name: 'Mathematical Literacy',
    category: 'Mathematical Sciences',
    description: 'Personal finance, measurement, map work, planning, models, and data handling.',
    icon: 'PieChart',
    color: '#0284c7',
    is_active: true,
  },
  {
    id: 'subj-phsc-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'PHSC-10',
    name: 'Physical Sciences',
    category: 'Natural Sciences',
    description: 'Matter and materials, chemical change, mechanics, waves, sound and light, electricity and magnetism.',
    icon: 'Zap',
    color: '#059669',
    is_active: true,
  },
  {
    id: 'subj-lfsc-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'LFSC-10',
    name: 'Life Sciences',
    category: 'Natural Sciences',
    description: 'Molecules to cells, cell division, plant and animal tissues, support and transport systems.',
    icon: 'Dna',
    color: '#10b981',
    is_active: true,
  },
  {
    id: 'subj-enhl-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'ENHL-10',
    name: 'English Home Language',
    category: 'Languages',
    description: 'Critical language awareness, literature analysis (poetry, novel, drama), and creative writing.',
    icon: 'BookOpen',
    color: '#7c3aed',
    is_active: true,
  },
  {
    id: 'subj-acct-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'ACCT-10',
    name: 'Accounting',
    category: 'Business, Commerce and Management',
    description: 'Accounting cycle, sole trader ledgers, financial statements, and internal control.',
    icon: 'Briefcase',
    color: '#d97706',
    is_active: true,
  },
  {
    id: 'subj-inft-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'INFT-10',
    name: 'Information Technology',
    category: 'Technology',
    description: 'Software design, algorithms, object-oriented programming (Java/Python), and databases.',
    icon: 'Code',
    color: '#4f46e5',
    is_active: true,
  },
  {
    id: 'subj-geog-10',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-10',
    code: 'GEOG-10',
    name: 'Geography',
    category: 'Humanities and Social Sciences',
    description: 'Composition of atmosphere, geomorphology, population distribution, and GIS.',
    icon: 'Globe',
    color: '#0891b2',
    is_active: true,
  },

  // Grade 12 (Matric)
  {
    id: 'subj-math-12',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-12',
    code: 'MATH-12',
    name: 'Mathematics',
    category: 'Mathematical Sciences',
    description: 'Differential calculus, sequences & series, cubic polynomials, trigonometry, geometry, and probability.',
    icon: 'Calculator',
    color: '#2563eb',
    is_active: true,
  },
  {
    id: 'subj-phsc-12',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-12',
    code: 'PHSC-12',
    name: 'Physical Sciences',
    category: 'Natural Sciences',
    description: 'Momentum, vertical projectile motion, organic chemistry, Doppler effect, electrodynamics, chemical equilibrium.',
    icon: 'Zap',
    color: '#059669',
    is_active: true,
  },
  {
    id: 'subj-lfsc-12',
    curriculum_id: 'a1b2c3d4-0000-0000-0000-000000000001',
    grade_id: 'grade-12',
    code: 'LFSC-12',
    name: 'Life Sciences',
    category: 'Natural Sciences',
    description: 'DNA, code of life, RNA and protein synthesis, meiosis, genetics and inheritance, evolution.',
    icon: 'Dna',
    color: '#10b981',
    is_active: true,
  },
];

export const INITIAL_TOPICS: Topic[] = [
  // Grade 8 Natural Sciences
  {
    id: 'topic-nsci8-01',
    subject_id: 'subj-nsci-8',
    title: 'Life and Living: Photosynthesis and Cellular Respiration',
    description: 'The process of radiant energy conversion into glucose by chlorophyll, carbon dioxide and water intake, oxygen release, and energy release in respiration.',
    sequence_order: 1,
    estimated_hours: 8,
  },

  // Grade 10 Physical Sciences
  {
    id: 'topic-phsc10-01',
    subject_id: 'subj-phsc-10',
    title: 'Matter and Materials: Kinetic Molecular Theory',
    description: 'States of matter, molecular kinetic theory, phase changes, and heating/cooling curves.',
    sequence_order: 1,
    estimated_hours: 8,
  },
  {
    id: 'topic-phsc10-02',
    subject_id: 'subj-phsc-10',
    title: 'Atomic Structure and the Periodic Table',
    description: 'Subatomic particles, atomic number, mass number, isotopes, and electron configurations.',
    sequence_order: 2,
    estimated_hours: 10,
  },
  {
    id: 'topic-phsc10-03',
    subject_id: 'subj-phsc-10',
    title: 'Chemical Bonding: Covalent, Ionic, and Metallic',
    description: 'Lewis dot formulas, sharing and transfer of electrons, electronegativity differences.',
    sequence_order: 3,
    estimated_hours: 10,
  },
  {
    id: 'topic-phsc10-04',
    subject_id: 'subj-phsc-10',
    title: 'Mechanics: Vectors and 1D Motion',
    description: 'Displacement, velocity, constant acceleration, and equations of motion.',
    sequence_order: 4,
    estimated_hours: 12,
  },

  // Grade 10 Mathematics
  {
    id: 'topic-math10-01',
    subject_id: 'subj-math-10',
    title: 'Algebraic Expressions & Factorisation',
    description: 'Multiplying polynomials, factorising trinomials, common factors, and difference of two squares.',
    sequence_order: 1,
    estimated_hours: 10,
  },
  {
    id: 'topic-math10-02',
    subject_id: 'subj-math-10',
    title: 'Equations and Inequalities',
    description: 'Solving linear, quadratic, and simultaneous equations, plus linear inequalities.',
    sequence_order: 2,
    estimated_hours: 12,
  },
  {
    id: 'topic-math10-03',
    subject_id: 'subj-math-10',
    title: 'Trigonometry: Definitions & Right-Angled Triangles',
    description: 'Sine, cosine, and tangent in right-angled triangles and Cartesian plane.',
    sequence_order: 3,
    estimated_hours: 14,
  },

  // Grade 12 Life Sciences
  {
    id: 'topic-lfsc12-01',
    subject_id: 'subj-lfsc-12',
    title: 'DNA: The Code of Life',
    description: 'Structure of DNA and RNA, DNA replication, transcription, and translation into proteins.',
    sequence_order: 1,
    estimated_hours: 12,
  },
  {
    id: 'topic-lfsc12-02',
    subject_id: 'subj-lfsc-12',
    title: 'Genetics and Inheritance',
    description: 'Mendelian genetics, monohybrid crosses, sex-linked traits, mutations, and pedigree charts.',
    sequence_order: 2,
    estimated_hours: 14,
  },
];

export const INITIAL_RESOURCES: EducationalResource[] = [
  {
    id: 'res-nsci8-tb',
    title: 'Grade 8 Natural Sciences: Photosynthesis and Cellular Respiration',
    description: 'CAPS Senior Phase module detailing solar radiant energy capture, the chloroplast food-making process, word and chemical equations, and plant energy storage.',
    file_url: '/materials/grade8_natural_sciences_photosynthesis.txt',
    storage_path: 'textbooks/gr8_nsci_photosynthesis.pdf',
    file_size_bytes: 2150000,
    file_type: 'pdf',
    category: 'textbook',
    grade_id: 'grade-8',
    subject_id: 'subj-nsci-8',
    topic_id: 'topic-nsci8-01',
    school_id: null,
    uploaded_by: 'system-curriculum-author',
    uploaded_by_name: 'DBE Senior Phase Natural Sciences Panel',
    is_published: true,
    copyright_notice: 'Approved CAPS Senior Phase Educational Resource.',
    permissions: 'public_to_grade',
    download_count: 188,
    view_count: 532,
    pages_count: 3,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-01-08T08:00:00Z',
    extracted_text: `CAPS GRADE 8 NATURAL SCIENCES: LIFE AND LIVING

PAGE 1: PHOTOSYNTHESIS FUNDAMENTALS
All living organisms require energy to survive, grow, and reproduce. The primary source of energy for almost all life on Earth is the sun.
Green plants are remarkable because they are able to capture this radiant light energy and transform it into chemical potential energy stored in food molecules.
This food-making process is called photosynthesis (from photo = light, and synthesis = putting together).

Requirements for Photosynthesis:
1. Chlorophyll: The green pigment found inside specialized plant cell organelles called chloroplasts. Chlorophyll traps light energy from the sun.
2. Sunlight: Provides the radiant energy required to drive the chemical reaction.
3. Water: Absorbed by plant roots from the soil and transported up through the stem to the leaves.
4. Carbon Dioxide: Absorbed from the surrounding atmosphere through tiny pores in the leaves called stomata.

PAGE 2: THE CHEMICAL REACTION & PRODUCTS
Inside the chloroplasts of leaf cells, water and carbon dioxide are rearranged using the trapped solar energy to produce glucose sugar and oxygen gas.

Word Equation:
Carbon Dioxide + Water + Light energy (with Chlorophyll) -> Glucose (Sugar) + Oxygen

Chemical Equation:
6CO2 + 6H2O + Radiant energy -> C6H12O6 + 6O2

Products of Photosynthesis:
1. Glucose: A simple carbohydrate sugar. Plants use glucose immediately for cellular growth and repair, or link glucose units together into complex starch molecules for storage in roots, stems, fruits, and seeds.
2. Oxygen: Released as a gaseous by-product into the atmosphere through the stomata, which animals and humans breathe.

PAGE 3: TESTING FOR STARCH AND CELLULAR RESPIRATION
Investigation: The Iodine Starch Test
To verify that photosynthesis has taken place in a leaf, scientists test for the presence of stored starch.
Steps:
1. Place a green leaf in boiling water for 1 minute to break down cell membranes.
2. Boil the leaf in methylated spirits/ethanol using a water bath to extract green chlorophyll (the leaf turns pale white).
3. Soften the leaf in warm water, spread it on a petri dish, and add drops of brown iodine solution.
Result: If starch is present, the iodine solution changes colour from brown to dark blue-black.

Cellular Respiration Comparison:
While photosynthesis builds glucose and releases oxygen in chloroplasts during daylight, cellular respiration occurs continuously in all plant and animal cells inside mitochondria:
Glucose + Oxygen -> Carbon Dioxide + Water + Usable Energy (ATP).`,
  },
  {
    id: 'res-phsc10-tb',
    title: 'Grade 10 Physical Sciences: Chemical Systems & Matter',
    description: 'Official CAPS-aligned textbook chapter covering atomic structure, periodic trends, chemical bonding, and the kinetic theory of matter.',
    file_url: '/materials/grade10_physical_sciences_matter.txt',
    storage_path: 'textbooks/gr10_phsc_matter.pdf',
    file_size_bytes: 2450000,
    file_type: 'pdf',
    category: 'textbook',
    grade_id: 'grade-10',
    subject_id: 'subj-phsc-10',
    topic_id: 'topic-phsc10-03',
    school_id: null, // platform-wide
    uploaded_by: 'system-curriculum-author',
    uploaded_by_name: 'Department of Basic Education / CAPS Science Committee',
    is_published: true,
    copyright_notice: 'Approved CAPS Open Educational Resource for South African Secondary Schools.',
    permissions: 'public_to_grade',
    download_count: 142,
    view_count: 489,
    pages_count: 4,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-10T08:00:00Z',
    extracted_text: `CHAPTER 3: CHEMICAL BONDING AND MOLECULAR STRUCTURE (CAPS GRADE 10)

PAGE 1: INTRODUCTION TO CHEMICAL BONDING
Chemical bonding is the fundamental force that holds atoms or ions together to form compounds and molecules. Atoms bond with one another to achieve a more stable, lower-energy electron configuration, typically resembling the nearest noble gas (octet rule: eight valence electrons in the outermost energy level).

There are three primary types of chemical bonds:
1. Covalent Bonding: The sharing of at least one pair of electrons between two non-metal atoms.
2. Ionic Bonding: The electrostatic attraction between oppositely charged ions formed by the transfer of electrons from a metal atom to a non-metal atom.
3. Metallic Bonding: The electrostatic attraction between positive metal atomic cores (cations) and a sea of delocalised valence electrons.

PAGE 2: COVALENT BONDING & LEWIS NOTATION
A covalent bond forms when two non-metal atoms overlap their valence electron orbitals, sharing electron pairs.
- Single covalent bond: One pair of electrons shared (e.g., H2, Cl2, CH4).
- Double covalent bond: Two pairs of electrons shared (e.g., O2, CO2).
- Triple covalent bond: Three pairs of electrons shared (e.g., N2, C2H2).

Electronegativity is the measure of the tendency of an atom to attract a bonding pair of electrons.
- Non-polar Covalent Bond: Equal sharing of electron pairs (electronegativity difference ΔEN = 0 to 0.4).
- Polar Covalent Bond: Unequal sharing of electron pairs due to a difference in electronegativity (0.4 < ΔEN < 2.0).
In polar bonds, the atom with higher electronegativity acquires a partial negative charge (δ-), while the other atom acquires a partial positive charge (δ+).

PAGE 3: IONIC BONDING & CRYSTAL LATTICES
Ionic bonding occurs between metals with low ionisation energy and non-metals with high electron affinity.
Example: Sodium Chloride (NaCl)
Sodium (Na, atomic number 11) has the electron configuration [Ne] 3s1. By losing its single 3s valence electron, it forms a stable sodium cation (Na+).
Chlorine (Cl, atomic number 17) has the configuration [Ne] 3s2 3p5. By gaining one electron, it achieves an argon configuration [Ar] and forms a chloride anion (Cl-).
The strong electrostatic attraction between Na+ and Cl- forms a giant ionic crystal lattice.

Properties of Ionic Compounds:
1. High melting and boiling points due to strong ionic electrostatic attractions.
2. Hard, brittle crystal structures.
3. Non-conductors of electricity in solid state, but electrical conductors when molten or dissolved in aqueous solution (free-moving ions).

PAGE 4: WORKED EXAMPLES AND EXAM TIPS
Example 1: Classify the bond in a water molecule (H2O).
Electronegativity of Oxygen = 3.44
Electronegativity of Hydrogen = 2.20
Difference ΔEN = 3.44 - 2.20 = 1.24
Conclusion: Since both atoms are non-metals and the electronegativity difference is 1.24, the O-H bonds are polar covalent bonds.

Examination Key Points:
- Always define electronegativity accurately: 'A measure of the tendency of an atom to attract a bonding pair of electrons.'
- Distinguish between intermolecular forces (between molecules) and intramolecular bonds (within molecules).`,
  },
  {
    id: 'res-math10-sg',
    title: 'Grade 10 Mathematics: Algebra, Trinomials & Equations Study Guide',
    description: 'Comprehensive study guide with worked examples, factorisation techniques, and practice examination questions for CAPS Term 1.',
    file_url: '/materials/grade10_mathematics_algebra.txt',
    storage_path: 'study_guides/gr10_math_algebra.pdf',
    file_size_bytes: 1890000,
    file_type: 'pdf',
    category: 'study_guide',
    grade_id: 'grade-10',
    subject_id: 'subj-math-10',
    topic_id: 'topic-math10-01',
    school_id: null,
    uploaded_by: 'system-curriculum-author',
    uploaded_by_name: 'Department of Basic Education / CAPS Math Committee',
    is_published: true,
    copyright_notice: 'Approved CAPS Open Educational Resource.',
    permissions: 'public_to_grade',
    download_count: 215,
    view_count: 610,
    pages_count: 3,
    created_at: '2026-01-12T09:00:00Z',
    updated_at: '2026-01-12T09:00:00Z',
    extracted_text: `CAPS GRADE 10 MATHEMATICS: ALGEBRA & EQUATIONS

PAGE 1: FACTORISATION FUNDAMENTALS
In Grade 10, algebraic manipulation forms the foundation of all subsequent work in calculus, functions, and trigonometry.

1. Highest Common Factor (HCF):
Always inspect the expression for a common factor before applying any other rule!
Example: 6x^2 - 18x = 6x(x - 3).

2. Difference of Two Squares (DOTS):
Rule: a^2 - b^2 = (a - b)(a + b)
Example: 9x^2 - 25y^2 = (3x - 5y)(3x + 5y). Note: a sum of squares (a^2 + b^2) cannot be factorised over the real numbers.

PAGE 2: FACTORISING QUADRATIC TRINOMIALS
Form: ax^2 + bx + c
When a = 1: Find two numbers whose product equals c and whose sum equals b.
Example: x^2 - 5x + 6
Factors of 6: (-2) * (-3) = 6, and (-2) + (-3) = -5.
Therefore: x^2 - 5x + 6 = (x - 2)(x - 3).

When a != 1: Use grouping or cross-multiplication.
Example: 2x^2 + 7x + 3
Factors of 2: (2)(1). Factors of 3: (1)(3).
(2x + 1)(x + 3) = 2x^2 + 6x + x + 3 = 2x^2 + 7x + 3.

PAGE 3: QUADRATIC EQUATIONS & THE ZERO FACTOR LAW
The Zero Factor Law states: If A * B = 0, then A = 0 or B = 0.
Steps to solve quadratic equations:
1. Move all terms to one side so the equation equals zero: ax^2 + bx + c = 0.
2. Factorise the left-hand side into linear factors.
3. Set each factor to zero and solve for x.
Example: Solve for x: x^2 - 9 = 0
(x - 3)(x + 3) = 0
x - 3 = 0  OR  x + 3 = 0
x = 3      OR  x = -3.`,
  },
  {
    id: 'res-lfsc12-tb',
    title: 'Grade 12 Life Sciences: DNA, Replication & Protein Synthesis',
    description: 'Detailed Matric study notes and diagrams on the structure of nucleic acids, transcription, translation, and genetic mutations.',
    file_url: '/materials/grade12_life_sciences_dna.txt',
    storage_path: 'textbooks/gr12_lfsc_dna.pdf',
    file_size_bytes: 3100000,
    file_type: 'pdf',
    category: 'textbook',
    grade_id: 'grade-12',
    subject_id: 'subj-lfsc-12',
    topic_id: 'topic-lfsc12-01',
    school_id: null,
    uploaded_by: 'system-curriculum-author',
    uploaded_by_name: 'National Senior Certificate Examination Panel',
    is_published: true,
    copyright_notice: 'NSC Approved Matric Learning Resource.',
    permissions: 'public_to_grade',
    download_count: 340,
    view_count: 890,
    pages_count: 3,
    created_at: '2026-01-14T10:00:00Z',
    updated_at: '2026-01-14T10:00:00Z',
    extracted_text: `CAPS GRADE 12 LIFE SCIENCES: DNA & PROTEIN SYNTHESIS

PAGE 1: MOLECULAR STRUCTURE OF DNA
Deoxyribonucleic acid (DNA) is the hereditary molecule located inside the cell nucleus of eukaryotic organisms and in mitochondria/chloroplasts.
DNA is a double-stranded polymer composed of repeating monomers called nucleotides.
Each nucleotide consists of three components:
1. A deoxyribose sugar molecule (5-carbon pentose).
2. A phosphate group.
3. One of four nitrogenous bases: Adenine (A), Thymine (T), Cytosine (C), or Guanine (G).

Base Pairing Rules (Chargaff's Rule):
Adenine pairs with Thymine via two weak hydrogen bonds (A = T).
Cytosine pairs with Guanine via three weak hydrogen bonds (C ≡ G).
The two strands run antiparallel to each other (5' to 3' and 3' to 5') forming a double helix.

PAGE 2: DNA REPLICATION
DNA replication is the process by which a cell creates an exact duplicate copy of its DNA before cell division (mitosis and meiosis) during the interphase of the cell cycle.
Significance: Ensures that each daughter cell receives an identical set of genetic instructions.
Process:
1. The enzyme DNA helicase unwinds and unzips the double helix by breaking weak hydrogen bonds between complementary nitrogenous bases.
2. Both exposed single strands act as templates.
3. Free deoxyribonucleotides in the nucleoplasm pair up with their complementary bases on each template strand according to the base-pairing rule.
4. DNA polymerase joins the sugar-phosphate backbone of the newly synthesized daughter strand.
5. Two identical DNA molecules are formed, each consisting of one original parent strand and one newly synthesized strand (semi-conservative replication).

PAGE 3: PROTEIN SYNTHESIS: TRANSCRIPTION & TRANSLATION
Protein synthesis occurs in two stages:
Stage 1: Transcription (takes place in the nucleus)
- A specific segment of DNA unwinds.
- One strand serves as a template to synthesize messenger RNA (mRNA).
- RNA nucleotides pair with DNA (Note: Uracil replaces Thymine; A pairs with U).
- mRNA leaves the nucleus via nuclear pores and travels to a ribosome in the cytoplasm.

Stage 2: Translation (takes place on the ribosome)
- Each group of three nitrogenous bases on mRNA is called a codon.
- Transfer RNA (tRNA) molecules carry specific amino acids and possess a complementary anticodon.
- The ribosome reads the codons sequentially, matching them with tRNA anticodons.
- Peptide bonds join adjacent amino acids into a polypeptide chain that folds into a functional protein.`,
  },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asmt-phsc10-01',
    school_id: 'sch-001',
    subject_id: 'subj-phsc-10',
    grade_id: 'grade-10',
    title: 'Grade 10 Physical Sciences: Chemical Bonding Mastery Test',
    description: 'Assessment covering covalent, ionic, and metallic bonding, Lewis structures, and electronegativity according to CAPS requirements.',
    assessment_type: 'quiz',
    total_marks: 20,
    passing_marks: 10,
    time_limit_minutes: 25,
    created_by: 'teacher-phsc-lead',
    is_published: true,
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'asmt-math10-01',
    school_id: 'sch-001',
    subject_id: 'subj-math-10',
    grade_id: 'grade-10',
    title: 'Grade 10 Mathematics: Algebraic Expressions & Equations Checkpoint',
    description: 'Solve polynomial factorisations, quadratic trinomials, and linear/quadratic equations.',
    assessment_type: 'assignment',
    total_marks: 25,
    passing_marks: 13,
    time_limit_minutes: 30,
    created_by: 'teacher-math-lead',
    is_published: true,
    created_at: '2026-02-03T11:00:00Z',
  },
];

export const INITIAL_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q-phsc10-1',
    assessment_id: 'asmt-phsc10-01',
    question_number: 1,
    question_type: 'multiple_choice',
    question_text: 'Which type of bond is formed when electrons are shared between two non-metal atoms?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    correct_answer: 'Covalent bond',
    explanation: 'A covalent bond involves the sharing of at least one electron pair between non-metallic atoms with similar electronegativities.',
    marks: 4,
  },
  {
    id: 'q-phsc10-2',
    assessment_id: 'asmt-phsc10-01',
    question_number: 2,
    question_type: 'multiple_choice',
    question_text: 'What is the electronegativity difference characteristic of a non-polar covalent bond?',
    options: ['ΔEN > 2.0', '0.4 < ΔEN < 2.0', 'ΔEN ≤ 0.4', 'ΔEN = 3.0'],
    correct_answer: 'ΔEN ≤ 0.4',
    explanation: 'A non-polar covalent bond occurs when electron pairs are shared equally between atoms, typically having an electronegativity difference of 0 to 0.4.',
    marks: 4,
  },
  {
    id: 'q-phsc10-3',
    assessment_id: 'asmt-phsc10-01',
    question_number: 3,
    question_type: 'multiple_choice',
    question_text: 'Why do ionic compounds conduct electricity when molten or dissolved in water, but not in the solid state?',
    options: [
      'Solid ionic compounds have free delocalised electrons.',
      'In molten or aqueous state, ions are free to move and carry charge.',
      'Water breaks the covalent bonds within the molecules.',
      'Metals always conduct electricity regardless of state.'
    ],
    correct_answer: 'In molten or aqueous state, ions are free to move and carry charge.',
    explanation: 'In the solid state, ions are locked in a rigid crystal lattice. When molten or in solution, the lattice is broken and the charged ions become mobile charge carriers.',
    marks: 6,
  },
  {
    id: 'q-phsc10-4',
    assessment_id: 'asmt-phsc10-01',
    question_number: 4,
    question_type: 'multiple_choice',
    question_text: 'What is the correct chemical formula and bond type for the compound formed between Magnesium (Mg) and Chlorine (Cl)?',
    options: [
      'MgCl, Covalent',
      'MgCl2, Ionic',
      'Mg2Cl, Ionic',
      'MgCl2, Covalent'
    ],
    correct_answer: 'MgCl2, Ionic',
    explanation: 'Magnesium loses 2 valence electrons to become Mg2+, while two Chlorine atoms each gain 1 electron to become Cl-. The resulting formula is MgCl2 and the bond is ionic.',
    marks: 6,
  },
];

