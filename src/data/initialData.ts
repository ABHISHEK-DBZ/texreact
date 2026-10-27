import type { Subject } from '../types';
import { DSA_EXPERIMENTS, DSA_QUESTION_BANK } from './dsaExperiments';
import { DVLSI_EXPERIMENTS, DVLSI_QUESTION_BANK } from './dvlsiExperiments';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'python',
    name: 'Python Programming',
    shortCode: 'PYTHON',
    description: 'Core and advanced Python programming laboratory experiments, algorithms, problem statements, and practical viva Q&A.',
    iconName: 'Code2',
    accentColor: '#3b82f6',
    isConfirmedName: true,
    experiments: [
      {
        id: 'py-exp-1',
        subjectId: 'python',
        expNumber: 1,
        title: 'Number Operations, Factorial & Prime Number Generation',
        topic: 'Control Structures & Math',
        chapter: 'Basic Python Syntax',
        aim: 'To write a Python program to compute the factorial of a number and generate prime numbers within a specified range.',
        problemStatement: 'Develop a menu-driven Python script that allows a user to input a positive integer and compute its factorial recursively/iteratively, and print all prime numbers up to N.',
        algorithm: [
          'Start the program and prompt the user to choose an operation: Factorial or Prime Range.',
          'For factorial: If n == 0 or n == 1, return 1; otherwise, return n * factorial(n - 1).',
          'For prime numbers: Iterate through numbers from 2 up to N. Check divisibility from 2 up to integer square root of the number.',
          'Print the computed results with clear formatted outputs.',
          'Terminate the program execution.'
        ],
        codeSnippets: [
          {
            language: 'python',
            filename: 'factorial_primes.py',
            explanation: 'Uses an efficient square root boundary check for prime verification and recursion for the mathematical factorial calculation.',
            code: `def calculate_factorial(n: int) -> int:
    """Computes factorial of a non-negative integer recursively."""
    if n < 0:
        raise ValueError("Factorial not defined for negative integers.")
    if n in (0, 1):
        return 1
    return n * calculate_factorial(n - 1)


def generate_primes_up_to(limit: int) -> list[int]:
    """Returns a list of prime numbers up to the specified limit."""
    primes = []
    for num in range(2, limit + 1):
        is_prime = True
        for divisor in range(2, int(num ** 0.5) + 1):
            if num % divisor == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
    return primes


if __name__ == "__main__":
    test_num = 6
    print(f"Factorial of {test_num} = {calculate_factorial(test_num)}")
    
    range_limit = 30
    print(f"Primes up to {range_limit}: {generate_primes_up_to(range_limit)}")`
          }
        ],
        sampleInput: 'test_num = 6\nrange_limit = 30',
        sampleOutput: 'Factorial of 6 = 720\nPrimes up to 30: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]',
        result: 'The program successfully computes factorials and primes accurately within the specified mathematical constraints.',
        conclusion: 'Recursive calls provide a concise expression for factorial, while restricting divisor checks up to sqrt(N) optimizes prime determination to O(sqrt(N)) per number.',
        vivaQuestions: [
          {
            id: 'py-viva-1-1',
            questionNumber: 1,
            subjectId: 'python',
            experimentId: 'py-exp-1',
            question: 'What is the maximum recursion depth in Python, and how can it be checked or modified?',
            answer: 'Python has a default recursion limit (typically 1000) to prevent stack overflow from runaway recursion. It can be inspected using sys.getrecursionlimit() and modified using sys.setrecursionlimit(limit).',
            category: 'viva'
          },
          {
            id: 'py-viva-1-2',
            questionNumber: 2,
            subjectId: 'python',
            experimentId: 'py-exp-1',
            question: 'Why do we only need to test factors up to the square root of N to determine if N is prime?',
            answer: 'If a number N has a factor greater than its square root, it must also have a corresponding factor smaller than its square root (since a * b = N). If no factor is found up to sqrt(N), no factor exists above it.',
            category: 'viva'
          }
        ]
      },
      {
        id: 'py-exp-2',
        subjectId: 'python',
        expNumber: 2,
        title: 'File I/O and Word Frequency Counter',
        topic: 'File Handling & Dictionaries',
        chapter: 'Data Structures & Files',
        aim: 'To write a Python script that reads a text file, cleans punctuation, and determines word frequencies using dictionaries.',
        problemStatement: 'Read an input text file, tokenize text into normalized words, count occurrences of each word, and display the top 5 most frequent terms.',
        algorithm: [
          'Open the specified text file in read mode using a context manager (`with open(...)`).',
          'Read contents, normalize case to lower, and strip punctuation characters.',
          'Split text into tokens using whitespace separators.',
          'Store counts in a standard dictionary or collections.Counter.',
          'Sort dictionary keys by frequency in descending order and output results.'
        ],
        codeSnippets: [
          {
            language: 'python',
            filename: 'word_frequency.py',
            explanation: 'Uses string translation to strip punctuation and a hash table (dict) to accumulate word occurrences in O(N) time.',
            code: `import string
from collections import Counter


def analyze_text_frequency(text: str, top_n: int = 5) -> list[tuple[str, int]]:
    # Remove punctuation and convert to lowercase
    cleaned = text.translate(str.maketrans("", "", string.punctuation)).lower()
    words = cleaned.split()
    counts = Counter(words)
    return counts.most_common(top_n)


sample_passage = """
Python is an interpreted, high-level, general-purpose programming language.
Python design philosophy emphasizes code readability with the use of significant indentation.
Python supports multiple programming paradigms.
"""

if __name__ == "__main__":
    results = analyze_text_frequency(sample_passage, top_n=3)
    for word, count in results:
        print(f"'{word}': {count} occurrences")`
          }
        ],
        sampleInput: 'A multi-line text passage containing repeating keywords.',
        sampleOutput: "'python': 3 occurrences\n'programming': 2 occurrences\n'is': 1 occurrences",
        result: 'Successfully demonstrated file reading, string sanitation, and dictionary frequency accumulation.',
        conclusion: 'Context managers ensure deterministic file descriptor closure, while hash-based counters provide optimal linear-time counting.',
        vivaQuestions: [
          {
            id: 'py-viva-2-1',
            questionNumber: 1,
            subjectId: 'python',
            experimentId: 'py-exp-2',
            question: 'What advantages does the `with` statement provide when operating on files in Python?',
            answer: 'The `with` statement utilizes Python context manager protocol (__enter__ and __exit__). It guarantees that the file stream is automatically closed as soon as the block terminates, even if exceptions are thrown.',
            category: 'viva'
          }
        ]
      }
    ],
    questionBank: [
      {
        id: 'py-qb-1',
        subjectId: 'python',
        question: 'What is the difference between shallow copy and deep copy in Python?',
        answer: 'A shallow copy (copy.copy) creates a new object but inserts references into it to the objects found in the original. A deep copy (copy.deepcopy) constructs a new compound object and recursively inserts copies of the objects found in the original, ensuring changes to nested structures do not mutate the source.',
        category: 'conceptual'
      },
      {
        id: 'py-qb-2',
        subjectId: 'python',
        question: 'Explain Python list comprehensions versus generator expressions in terms of memory utilization.',
        answer: 'List comprehensions evaluate and allocate memory for all elements immediately in a new list [x for x in data]. Generator expressions (x for x in data) produce items lazily on demand using the iterator protocol, maintaining O(1) auxiliary memory consumption.',
        category: 'conceptual'
      }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures and Algorithms',
    shortCode: 'DSA',
    description: 'Comprehensive Python implementations for all 9 laboratory experiments directly from the course reference PDF: Array operations, Stacks, Queues, Singly and Doubly Linked Lists, Insertion Sort, Binary Search Trees, BFS Graph Traversal, and Infix to Prefix conversion.',
    iconName: 'Layers',
    accentColor: '#10b981',
    isConfirmedName: true,
    experiments: DSA_EXPERIMENTS,
    questionBank: DSA_QUESTION_BANK
  },
  {
    id: 'mpm',
    name: 'MPM',
    shortCode: 'MPM',
    description: 'Microprocessors and Microcontrollers / MPM lab experiments, architecture, assembly language programs, registers, and timing cycles.',
    iconName: 'Cpu',
    accentColor: '#f59e0b',
    isConfirmedName: false,
    experiments: [
      {
        id: 'mpm-exp-1',
        subjectId: 'mpm',
        expNumber: 1,
        title: '8-Bit Addition and Subtraction with Carry Handling',
        topic: 'Arithmetic Instructions',
        chapter: '8085 Microprocessor Assembly',
        aim: 'To write an assembly language program for the 8085 microprocessor to perform 8-bit addition and subtraction with carry/borrow determination.',
        theory: 'The 8085 is an 8-bit NMOS microprocessor. It contains an Accumulator (A register), flag register, and general-purpose registers (B, C, D, E, H, L). The ADD and SUB instructions execute arithmetic on operand contents with register A, updating Carry (CY), Zero (Z), Sign (S), Parity (P), and Auxiliary Carry (AC) flags.',
        algorithm: [
          'Load operand 1 from memory address 2050H into register A using LDA 2050H.',
          'Load operand 2 from memory address 2051H into register B using LDA 2051H and MOV B, A.',
          'Initialize register C to 00H to track carry/borrow state.',
          'Add register B to Accumulator (ADD B).',
          'Check carry flag (JNC SKIP). If carry is generated, increment register C.',
          'Store sum in 2052H and carry in 2053H.',
          'Halt execution using HLT.'
        ],
        codeSnippets: [
          {
            language: 'bash',
            filename: 'add8bit.asm',
            explanation: 'Standard 8085 assembly instructions utilizing Accumulator (A) and B register with conditional jump (JNC).',
            code: `; 8-bit Addition with Carry in 8085
MVI C, 00H     ; Clear register C for carry
LDA 2050H      ; Load first operand from 2050H into Accumulator
MOV B, A       ; Transfer first operand to Register B
LDA 2051H      ; Load second operand into Accumulator
ADD B          ; A = A + B
JNC SKIP       ; If carry not generated, skip increment
INR C          ; Increment carry register
SKIP:
STA 2052H      ; Store 8-bit sum at 2052H
MOV A, C       ; Move carry count to Accumulator
STA 2053H      ; Store carry at 2053H
HLT            ; Stop execution`
          }
        ],
        sampleInput: 'Memory 2050H: 95H\nMemory 2051H: 84H',
        sampleOutput: 'Memory 2052H (Sum): 19H\nMemory 2053H (Carry): 01H',
        result: 'The 8-bit addition with carry was successfully simulated and observed at target memory locations.',
        conclusion: 'Arithmetic overflow beyond 8-bit capacity (FFH) sets the CY flag, which is correctly detected and recorded in register C.',
        vivaQuestions: [
          {
            id: 'mpm-viva-1-1',
            questionNumber: 1,
            subjectId: 'mpm',
            experimentId: 'mpm-exp-1',
            question: 'What are the flag bits available in the 8085 flag register?',
            answer: 'The 8085 has five active flag bits: Sign (S), Zero (Z), Auxiliary Carry (AC), Parity (P), and Carry (CY). Three bits are unused/undefined.',
            category: 'viva'
          },
          {
            id: 'mpm-viva-1-2',
            questionNumber: 2,
            subjectId: 'mpm',
            experimentId: 'mpm-exp-1',
            question: 'What is the function of the ALE (Address Latch Enable) signal in 8085?',
            answer: 'ALE is an active-high output pulse generated by the 8085 during the T1 state of machine cycles. It indicates that bits on the multiplexed AD0-AD7 lines represent address bits, enabling external latches (like 74LS373) to demultiplex the address from data.',
            category: 'viva'
          }
        ]
      }
    ],
    questionBank: [
      {
        id: 'mpm-qb-1',
        subjectId: 'mpm',
        question: 'Differentiate between memory-mapped I/O and peripheral I/O (isolated I/O) in 8085.',
        answer: 'In memory-mapped I/O, I/O devices are treated as memory addresses using 16-bit addresses; memory instructions (LDA, STA, MOV) apply, but it consumes memory space. In isolated I/O (peripheral mapped), I/O devices use 8-bit port addresses via dedicated IN and OUT instructions, saving addressable memory space.',
        category: 'theory'
      }
    ]
  },
  {
    id: 'dvlsi',
    name: 'Digital VLSI Design',
    shortCode: 'DVLSI',
    description: 'Digital VLSI & CMOS circuit design laboratory: MOSFET drain/transfer characteristics, Dennard scaling analysis, cross-coupled CMOS SR latch, NMOS resistive inverter, and CMOS inverter VTC & transient dynamics simulated in LTspice XVII.',
    iconName: 'Cpu',
    accentColor: '#8b5cf6',
    isConfirmedName: true,
    experiments: DVLSI_EXPERIMENTS,
    questionBank: DVLSI_QUESTION_BANK
  }
];
