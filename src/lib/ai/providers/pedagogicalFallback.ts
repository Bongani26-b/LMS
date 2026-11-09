import { AIProvider, AIQueryRequest, AIQueryResponse } from '../types';

export class PedagogicalFallbackProvider implements AIProvider {
  name = 'CAPS Educational Intelligence Engine (Built-in)';

  async isAvailable(): Promise<boolean> {
    return true; // Always ready
  }

  async generate(request: AIQueryRequest): Promise<AIQueryResponse> {
    const { prompt, highlightedText, subjectName, gradeName, topicTitle } = request;
    const combinedText = `${prompt} ${highlightedText || ''}`.toLowerCase();

    // Pedagogical concept detection
    let topicExplanation = '';
    const keyTakeaways: string[] = [];
    const suggestedQuestions: string[] = [];

    if (combinedText.includes('covalent') || combinedText.includes('share') || combinedText.includes('sharing')) {
      topicExplanation = `### Understanding Covalent Bonding (CAPS ${gradeName || 'Grade 10'} ${subjectName || 'Physical Sciences'})

**1. What is happening in the highlighted concept?**
In covalent bonding, two non-metal atoms need extra valence electrons to fill their outer electron energy level (the octet rule). Neither atom is willing to give away its electrons entirely. Instead, they **share** pairs of electrons between their overlapping orbitals.

**2. Breaking it down step-by-step:**
- **Step 1: Electrostatic balance:** The negatively charged shared electrons are attracted simultaneously to the positive nuclei of both atoms.
- **Step 2: Electronegativity check:** If the electronegativity difference is small ($\\Delta EN \\le 0.4$), the electrons are shared equally (non-polar covalent, like $H_2$ or $Cl_2$). If there is a difference between $0.4$ and $2.0$, one atom pulls the electrons closer, creating partial charges $\\delta^+$ and $\\delta^-$ (polar covalent, like $H_2O$ or $HCl$).
- **Step 3: Bond multiplicity:** Atoms can share one pair (single bond), two pairs (double bond, like $O_2$), or three pairs (triple bond, like $N_2$).

**3. Memory Analogy:**
Imagine two students holding a heavy textbook between them with both hands. Neither owns it alone, but together they keep it stable.

**4. CAPS Exam Tip:**
When asked to define a covalent bond, write the exact Department of Basic Education definition: *"The sharing of at least one pair of electrons by two atoms."*`;

      keyTakeaways.push(
        'Covalent bonds occur between non-metals through electron sharing.',
        'Polar covalent bonds have unequal electron sharing (0.4 < ΔEN < 2.0).',
        'Covalent molecules generally have lower melting points than ionic compounds due to weaker intermolecular forces.'
      );

      suggestedQuestions.push(
        'What is the difference between intramolecular bonds and intermolecular forces?',
        'How do I draw the Lewis dot diagram for water (H2O)?',
        'Why does nitrogen form a triple bond?'
      );
    } else if (combinedText.includes('ionic') || combinedText.includes('lattice') || combinedText.includes('transfer')) {
      topicExplanation = `### Understanding Ionic Bonding (CAPS ${gradeName || 'Grade 10'} ${subjectName || 'Physical Sciences'})

**1. Core Concept:**
Ionic bonding occurs when a metal atom **transfers** one or more valence electrons to a non-metal atom.

**2. How it works:**
- **The Metal (e.g., Sodium Na):** Has low ionisation energy. It readily loses an electron to form a positively charged cation ($Na^+$).
- **The Non-Metal (e.g., Chlorine Cl):** Has high electron affinity. It gains the electron to form a negatively charged anion ($Cl^-$).
- **The Electrostatic Attraction:** The opposite charges attract each other vigorously, assembling into a 3D crystalline lattice.

**3. Key Properties for Assessments:**
- High melting and boiling points because breaking the crystal lattice requires huge thermal energy.
- Solid crystals are non-conductors because ions cannot move.
- In molten state or dissolved in water, the ions are free to move, enabling electrical conduction.`;

      keyTakeaways.push(
        'Ionic bonds involve complete electron transfer from metal to non-metal.',
        'Creates an electrostatic attraction between cations (+) and anions (-).',
        'Conducts electricity ONLY when molten or in aqueous solution.'
      );

      suggestedQuestions.push(
        'Why does table salt (NaCl) crack when struck with a hammer?',
        'What is an electrolyte in the CAPS syllabus?'
      );
    } else if (combinedText.includes('factor') || combinedText.includes('trinomial') || combinedText.includes('quadratic') || combinedText.includes('algebra')) {
      topicExplanation = `### Step-by-Step Algebra & Factorisation (CAPS ${gradeName || 'Grade 10'} Mathematics)

**1. Strategy for factoring expressions:**
- **Step 1: Always check for a Common Factor first!**
  Example: In $3x^2 - 12x$, factor out $3x$ first: $3x(x - 4)$.
- **Step 2: Count the terms:**
  - **2 terms:** Check for Difference of Two Squares ($a^2 - b^2 = (a-b)(a+b)$).
  - **3 terms:** Standard quadratic trinomial ($ax^2 + bx + c$).
  - **4 terms:** Grouping in pairs.

**2. Trinomial Factoring Formula:**
For $x^2 + bx + c$:
Find two integers $p$ and $q$ such that:
$p \\times q = c$ (their product gives the last term)
$p + q = b$ (their sum gives the middle coefficient).
Result: $(x + p)(x + q)$.

**3. CAPS Exam Caution:**
A sum of two squares like $(x^2 + 16)$ **cannot** be factorised into real linear factors! Do not write $(x+4)(x+4)$.`;

      keyTakeaways.push(
        'Always look for the Highest Common Factor (HCF) first.',
        'Difference of squares: a² - b² = (a - b)(a + b).',
        'To solve quadratic equations, set the expression to zero before factorising.'
      );

      suggestedQuestions.push(
        'How do I factorise when the coefficient a is greater than 1?',
        'Can you show me how to solve a quadratic equation by factorisation?'
      );
    } else if (combinedText.includes('dna') || combinedText.includes('replication') || combinedText.includes('protein') || combinedText.includes('rna')) {
      topicExplanation = `### Understanding DNA & Molecular Genetics (CAPS ${gradeName || 'Grade 12'} Life Sciences)

**1. Structure Overview:**
DNA is a double-stranded polymer made of nucleotide monomers:
- 1 Deoxyribose sugar + 1 Phosphate group + 1 Nitrogenous base (A, T, C, G).
- **Complementary Base Pairing:** Adenine pairs with Thymine ($A=T$); Cytosine pairs with Guanine ($C \\equiv G$).

**2. DNA Replication Steps:**
1. **Unwinding & Unzipping:** The double helix unwinds and unzips as weak hydrogen bonds break (enzyme: DNA helicase).
2. **Template Strands:** Each original strand acts as a template.
3. **Complementary Nucleotides:** Free nucleotides in the nucleoplasm pair up according to base-pairing rules.
4. **Result:** Two identical DNA molecules are formed, each with one parent strand and one new daughter strand (**semi-conservative**).

**3. NSC Matric Exam Tip:**
Know the difference between DNA and RNA:
- DNA has deoxyribose sugar and Thymine, double-stranded.
- RNA has ribose sugar and Uracil (no Thymine!), single-stranded.`;

      keyTakeaways.push(
        'DNA replication occurs during interphase before cell division.',
        'Base pairing: A pairs with T (or U in RNA), C pairs with G.',
        'Protein synthesis requires Transcription (in nucleus) and Translation (at ribosome).'
      );

      suggestedQuestions.push(
        'What is a codon and anticodon?',
        'What happens when a mutation occurs during DNA replication?'
      );
    } else {
      // General tailored response
      topicExplanation = `### CAPS Learning Assistant Explanation (${gradeName || 'Secondary'} • ${subjectName || 'Curriculum'})

**1. Analyzing Your Question:**
You asked: *"${prompt}"*

${highlightedText ? `Regarding your highlighted textbook section:\n> *"${highlightedText}"*\n` : ''}

**2. Step-by-Step Breakdown:**
- **Curriculum Alignment:** In the CAPS secondary school framework for ${topicTitle || subjectName || 'this subject'}, understanding core definitions and principles is essential for examinations.
- **Core Principle:** When approaching this concept, identify the foundational rule or law that applies first, then break the problem into smaller measurable components.
- **Application:** Apply the approved method demonstrated in your textbook worked examples, verifying units and formulas where applicable.

**3. Exam Preparation Recommendation:**
Review the key summary at the end of the chapter and attempt the end-of-section diagnostic questions.`;

      keyTakeaways.push(
        `Focus on mastering the CAPS definition for ${subjectName || 'this topic'}.`,
        'Work through textbook exercises step-by-step before attempting past exam papers.'
      );

      suggestedQuestions.push(
        `What are the most frequent exam questions on ${subjectName || 'this topic'}?`,
        'Can you break this down into a simpler analogy?'
      );
    }

    return {
      answer: topicExplanation,
      keyTakeaways,
      suggestedQuestions,
      contextUsed: request.contextChunks || [],
      modelName: 'CAPS Educational Intelligence Engine (Offline / Local)',
      provider: 'local_fallback',
      timestamp: new Date().toISOString(),
    };
  }
}

