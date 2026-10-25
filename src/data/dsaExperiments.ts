import type { Experiment, QuestionItem } from '../types';

export const DSA_EXPERIMENTS: Experiment[] = [
  {
    id: 'dsa-exp-1',
    subjectId: 'dsa',
    expNumber: 1,
    title: 'Array Operations (Insertion, Deletion, Min, Max, Display)',
    topic: 'Arrays & Linear Data Structures',
    chapter: 'Experiment 1',
    aim: 'To implement basic array operations - insertion, deletion, finding the smallest element, and finding the largest element - using Python.',
    problemStatement: 'Develop a menu-driven program in Python to maintain an integer list, supporting 1-based index insertion and deletion with boundary validation, linear search for minimum and maximum values, and full array display.',
    prerequisites: [
      {
        concept: 'Contiguous Memory & Indexing',
        explanation: 'An array stores elements in contiguous memory locations. In Python, a list is an dynamic array. While Python natively uses 0-based indexing (0 to n-1), student lab manuals often ask for 1-based user input (1 to n), requiring a pos - 1 index conversion.',
        example: 'If list is [10, 20, 30], user position 2 corresponds to internal index pos - 1 = 1 (element 20).'
      },
      {
        concept: 'Element Shifting Cost',
        explanation: 'Inserting or deleting an element at an arbitrary position requires shifting all subsequent elements right or left. This makes insert and delete operations take linear time O(n) in worst and average cases.',
        example: 'Inserting 99 at index 0 shifts all existing n elements one step to the right.'
      }
    ],
    algorithm: [
      'Read initial array elements from the user as space-separated integers.',
      'Display interactive menu: 1. Insert, 2. Delete, 3. Find Smallest, 4. Find Largest, 5. Display Array, 6. Exit.',
      'For Insert: Input 1-based position and value. If 1 <= pos <= len(arr) + 1, insert value at arr.insert(pos - 1, value); otherwise print "Invalid position".',
      'For Delete: Input 1-based position. If 1 <= pos <= len(arr), remove element at arr.pop(pos - 1); otherwise print "Invalid position".',
      'For Smallest / Largest: If array is non-empty, print min(arr) / max(arr); otherwise display "Array is empty".',
      'For Display: Print the current state of the array.',
      'Repeat the menu loop until the user selects option 6 (Exit).'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'array_operations.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 1–3). Menu-driven console interface with validation checks.',
        code: `def insert(arr):
    pos = int(input("Enter position: "))
    value = int(input("Enter number to insert: "))
    if 1 <= pos <= len(arr) + 1:
        arr.insert(pos - 1, value)
        print("Array:", arr)
    else:
        print("Invalid position")

def delete(arr):
    pos = int(input("Enter position to delete: "))
    if 1 <= pos <= len(arr):
        arr.pop(pos - 1)
        print("Array:", arr)
    else:
        print("Invalid position")

arr = list(map(int, input("Enter array elements: ").split()))

while True:
    print("\\n1. Insert")
    print("2. Delete")
    print("3. Find Smallest")
    print("4. Find Largest")
    print("5. Display Array")
    print("6. Exit")
    choice = int(input("Enter your choice: "))
    if choice == 1:
        insert(arr)
    elif choice == 2:
        delete(arr)
    elif choice == 3:
        if arr:
            print("Smallest number:", min(arr))
        else:
            print("Array is empty")
    elif choice == 4:
        if arr:
            print("Largest number:", max(arr))
        else:
            print("Array is empty")
    elif choice == 5:
        print("Array:", arr)
    elif choice == 6:
        break
    else:
        print("Invalid choice")`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Lines 1–7',
        codeSnippet: `def insert(arr):
    pos = int(input("Enter position: "))
    value = int(input("Enter number to insert: "))
    if 1 <= pos <= len(arr) + 1:
        arr.insert(pos - 1, value)
        print("Array:", arr)`,
        whatItDoes: 'Reads the desired 1-based insertion position and value from user input.',
        whyNeeded: 'Allows adding a new element at the beginning, middle, or immediately after the last element.',
        variables: 'pos: 1-based user rank, value: integer to insert, arr: target list.',
        conditionOrOperation: '1 <= pos <= len(arr) + 1 ensures the position is neither negative, zero, nor beyond the current length + 1.',
        contribution: 'Updates the list in-place and provides visual feedback to the user.'
      },
      {
        lineRange: 'Lines 9–15',
        codeSnippet: `def delete(arr):
    pos = int(input("Enter position to delete: "))
    if 1 <= pos <= len(arr):
        arr.pop(pos - 1)
        print("Array:", arr)`,
        whatItDoes: 'Validates and deletes an existing element at the specified 1-based position using Python pop().',
        whyNeeded: 'Removes unwanted values from the collection.',
        variables: 'pos: position of element to remove.',
        conditionOrOperation: '1 <= pos <= len(arr) ensures the index exists; prevents IndexError.',
        contribution: 'Reduces array size by 1 and shifts trailing items leftward.'
      },
      {
        lineRange: 'Line 17',
        codeSnippet: `arr = list(map(int, input("Enter array elements: ").split()))`,
        whatItDoes: 'Reads a line of text, splits by space, converts each string token to an int, and wraps into a list.',
        whyNeeded: 'Initializes the working array in a single convenient console line.',
        contribution: 'Creates the core mutable data structure.'
      },
      {
        lineRange: 'Lines 19–47',
        codeSnippet: `while True:
    # menu printing and if-elif dispatch`,
        whatItDoes: 'Main interactive event loop that prompts for user choice (1–6) and invokes the respective operation.',
        whyNeeded: 'Keeps the program running continuously until the user explicitly selects 6 (Exit).',
        contribution: 'Provides menu-driven workflow required by the laboratory specification.'
      }
    ],
    dryRun: {
      title: 'Insertion and Deletion Execution Trace',
      description: 'Starting with initial array [10, 20, 30] and executing an insert, delete, and min check.',
      initialInput: 'Array: 10 20 30',
      steps: [
        {
          stepNumber: 1,
          action: 'Initial array creation',
          stateOrVariables: 'arr = [10, 20, 30], len = 3',
          outputOrLog: 'Array initialized'
        },
        {
          stepNumber: 2,
          action: 'Select 1 (Insert): pos = 2, value = 15',
          stateOrVariables: 'Valid: 1 <= 2 <= 4. Insert at index 2 - 1 = 1',
          outputOrLog: 'Array: [10, 15, 20, 30]'
        },
        {
          stepNumber: 3,
          action: 'Select 2 (Delete): pos = 3',
          stateOrVariables: 'Valid: 1 <= 3 <= 4. Remove index 3 - 1 = 2 (element 20)',
          outputOrLog: 'Array: [10, 15, 30]'
        },
        {
          stepNumber: 4,
          action: 'Select 3 (Find Smallest)',
          stateOrVariables: 'arr is non-empty. min([10, 15, 30]) evaluated',
          outputOrLog: 'Smallest number: 10'
        }
      ],
      finalOutput: 'Array: [10, 15, 30]'
    },
    sampleInput: `Enter array elements: 10 20 30
Enter your choice: 1
Enter position: 2
Enter number to insert: 15
Enter your choice: 4
Enter your choice: 6`,
    sampleOutput: `Array: [10, 15, 20, 30]
Largest number: 30
Program exited.`,
    timeComplexity: 'Insertion: O(n) | Deletion: O(n) | Min/Max: O(n) | Display: O(n)',
    spaceComplexity: 'O(1) auxiliary space (modifies input list in-place)',
    complexityExplanation: 'Inserting or deleting an element at index i requires shifting (n - i) elements, taking O(n) time. Finding min or max checks all n elements linearly.',
    result: 'The basic array operations of insertion, deletion, minimum, and maximum value searching were successfully executed with boundary checks.',
    conclusion: 'Arrays provide O(1) random access by index, but modifications (insert/delete) incur an O(n) shifting overhead.',
    vivaQuestions: [
      {
        id: 'dsa-v-1-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-1',
        question: 'Why is insertion in an array considered an O(n) operation rather than O(1)?',
        answer: 'Because arrays store elements in contiguous memory. When inserting at the beginning or middle, all subsequent elements must be shifted one position to the right to make room, requiring up to n operations in the worst case.',
        category: 'viva'
      },
      {
        id: 'dsa-v-1-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-1',
        question: 'What is the purpose of checking `1 <= pos <= len(arr) + 1` during insertion?',
        answer: 'It verifies that the requested 1-based position is valid: pos = 1 inserts at the front, pos = len(arr) + 1 appends at the end, and any value outside this range would create an illegal gap or negative index.',
        category: 'viva'
      },
      {
        id: 'dsa-v-1-3',
        questionNumber: 3,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-1',
        question: 'What is the difference between Python list and a traditional C/C++ static array?',
        answer: 'A traditional array in C has a fixed size allocated at compile time. A Python list is a dynamic array (pointer array) that can automatically resize when capacity is exceeded using geometric memory reallocation.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'User position is 1-based; Python index is 0-based (convert using pos - 1).',
        'Valid insert positions range from 1 to len(arr) + 1.',
        'Valid delete positions range from 1 to len(arr).',
        'Both insert() and pop() take O(n) time due to contiguous memory element shifting.'
      ],
      commonPitfalls: [
        'Confusing 1-based user input with 0-based Python indexing leading to off-by-one errors.',
        'Calling min() or max() on an empty list throws a ValueError if not checked with `if arr:` first.'
      ],
      examTips: [
        'Always state the time complexity of insert as O(n) and lookup as O(1).',
        'Mention boundary condition check before performing any array modification in viva.'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '1–3'
    }
  },
  {
    id: 'dsa-exp-2',
    subjectId: 'dsa',
    expNumber: 2,
    title: 'Stack Using Array (Fixed Capacity)',
    topic: 'Stack',
    chapter: 'Experiment 2',
    aim: 'To implement a stack with a fixed capacity using an array (list) and perform Push, Pop, Peek, and Display operations.',
    problemStatement: 'Construct a stack data structure in Python constrained to a maximum capacity of 5 items. Implement overflow handling on Push and underflow handling on Pop and Peek.',
    prerequisites: [
      {
        concept: 'LIFO (Last In, First Out) Principle',
        explanation: 'A stack operates on the LIFO principle: the element placed into the stack most recently is the first one to be removed. Think of a stack of plates: you add to the top and take from the top.',
        example: 'If you push 10, then push 20, the first pop returns 20.'
      },
      {
        concept: 'Overflow vs Underflow',
        explanation: 'Stack Overflow occurs when an attempt is made to Push an element into a full stack (len == MAX). Stack Underflow occurs when an attempt is made to Pop or Peek from an empty stack (len == 0).',
        example: 'When MAX = 5 and len(stack) == 5, another push displays "Stack is Full".'
      }
    ],
    algorithm: [
      'Initialize MAX = 5 and an empty list stack = [].',
      'Push Operation: Check if len(stack) == MAX. If true, print "Stack is Full" (Overflow); otherwise prompt for integer and append to stack.',
      'Pop Operation: Check if len(stack) == 0. If true, print "Stack is Empty" (Underflow); otherwise remove and display stack.pop().',
      'Peek Operation: Check if len(stack) == 0. If true, print "Stack is Empty"; otherwise display the top element stack[-1] without removing it.',
      'Display Operation: If stack is empty print "Stack is Empty"; otherwise print the complete stack from bottom to top.',
      'Repeat via menu until choice is 5 (Exit).'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'stack_array.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 3–4). Fixed size bounded stack.',
        code: `MAX = 5
stack = []

while True:
    print("\\n1. Push")
    print("2. Pop")
    print("3. Peek")
    print("4. Display")
    print("5. Exit")
    choice = int(input("Enter your choice: "))
    if choice == 1:
        if len(stack) == MAX:
            print("Stack is Full")
        else:
            value = int(input("Enter number to push: "))
            stack.append(value)
            print("Stack:", stack)
    elif choice == 2:
        if len(stack) == 0:
            print("Stack is Empty")
        else:
            print("Deleted element:", stack.pop())
            print("Stack:", stack)
    elif choice == 3:
        if len(stack) == 0:
            print("Stack is Empty")
        else:
            print("Top element:", stack[-1])
    elif choice == 4:
        if len(stack) == 0:
            print("Stack is Empty")
        else:
            print("Stack:", stack)
    elif choice == 5:
        break
    else:
        print("Invalid choice")`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Lines 1–2',
        codeSnippet: `MAX = 5\nstack = []`,
        whatItDoes: 'Declares maximum limit (5) and creates an empty list as the underlying container.',
        whyNeeded: 'Simulates a fixed-capacity static stack in memory.',
        variables: 'MAX: maximum size boundary, stack: list holding elements.',
        contribution: 'Establishes initial stack state.'
      },
      {
        lineRange: 'Lines 13–19',
        codeSnippet: `if choice == 1:\n    if len(stack) == MAX:\n        print("Stack is Full")\n    else:\n        value = int(input("Enter number to push: "))\n        stack.append(value)`,
        whatItDoes: 'Performs Push: tests if capacity is reached before appending.',
        whyNeeded: 'Prevents stack overflow.',
        conditionOrOperation: 'len(stack) == MAX condition guards against adding more than 5 elements.',
        contribution: 'Maintains bounded capacity.'
      },
      {
        lineRange: 'Lines 21–27',
        codeSnippet: `elif choice == 2:\n    if len(stack) == 0:\n        print("Stack is Empty")\n    else:\n        print("Deleted element:", stack.pop())`,
        whatItDoes: 'Performs Pop: checks if empty, then removes the last appended item with pop().',
        whyNeeded: 'Executes LIFO removal in O(1) time.',
        conditionOrOperation: 'len(stack) == 0 guards against popping an empty list.',
        contribution: 'Removes the top of the stack safely.'
      },
      {
        lineRange: 'Lines 28–33',
        codeSnippet: `elif choice == 3:\n    if len(stack) == 0:\n        print("Stack is Empty")\n    else:\n        print("Top element:", stack[-1])`,
        whatItDoes: 'Reads the top element stack[-1] without mutating the list.',
        whyNeeded: 'Peek/Top inspection without data deletion.',
        contribution: 'Returns current top element.'
      }
    ],
    dryRun: {
      title: 'Push, Peek and Pop Sequence (MAX = 5)',
      description: 'Pushing 3 elements, inspecting top, and popping.',
      initialInput: 'Empty stack: []',
      steps: [
        {
          stepNumber: 1,
          action: 'Push 10',
          stateOrVariables: 'stack = [10], len = 1',
          outputOrLog: 'Stack: [10]'
        },
        {
          stepNumber: 2,
          action: 'Push 20',
          stateOrVariables: 'stack = [10, 20], len = 2',
          outputOrLog: 'Stack: [10, 20]'
        },
        {
          stepNumber: 3,
          action: 'Peek',
          stateOrVariables: 'stack[-1] is 20',
          outputOrLog: 'Top element: 20'
        },
        {
          stepNumber: 4,
          action: 'Pop',
          stateOrVariables: 'stack.pop() removes 20; stack = [10]',
          outputOrLog: 'Deleted element: 20'
        }
      ],
      finalOutput: 'Stack: [10]'
    },
    sampleInput: `1 -> 10
1 -> 20
3
2
5`,
    sampleOutput: `Stack: [10]
Stack: [10, 20]
Top element: 20
Deleted element: 20
Stack: [10]`,
    timeComplexity: 'Push: O(1) | Pop: O(1) | Peek: O(1) | Display: O(n)',
    spaceComplexity: 'O(MAX) = O(1) auxiliary space',
    complexityExplanation: 'append() and pop() on the end of a Python list require no element shifting, executing in O(1) constant time.',
    result: 'The fixed-capacity stack operations were successfully implemented with overflow and underflow protection.',
    conclusion: 'Stacks provide instant O(1) access to the most recently added item, making them ideal for recursion, parsing, and undo histories.',
    vivaQuestions: [
      {
        id: 'dsa-v-2-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-2',
        question: 'What is the time complexity of Push and Pop in an array-based stack and why?',
        answer: 'Both Push and Pop take O(1) constant time because operations occur strictly at the end of the list, requiring no element shifting.',
        category: 'viva'
      },
      {
        id: 'dsa-v-2-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-2',
        question: 'What are real-world applications of the Stack data structure?',
        answer: 'Expression evaluation/syntax parsing, call stack in function recursion, undo/redo mechanisms in text editors, and back-button navigation in web browsers.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Stack is LIFO: Last In, First Out.',
        'Push adds to the end (`append()`); Pop removes from the end (`pop()`).',
        'Peek accesses `stack[-1]` without removing it.',
        'Push, Pop, and Peek are all O(1) operations.'
      ],
      commonPitfalls: [
        'Popping an empty stack raises IndexError unless guarded by `if len(stack) == 0`.',
        'Confusing Stack (LIFO) with Queue (FIFO).'
      ],
      examTips: [
        'Always define Stack Overflow (attempt to push to full stack) and Underflow (attempt to pop from empty stack).'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '3–4'
    }
  },
  {
    id: 'dsa-exp-3',
    subjectId: 'dsa',
    expNumber: 3,
    title: 'Linear Queue Using Array (Fixed Capacity)',
    topic: 'Queue',
    chapter: 'Experiment 3',
    aim: 'To implement a linear queue with a fixed capacity using an array (list) and perform Enqueue, Dequeue, Peek, and Display operations.',
    problemStatement: 'Construct a linear queue in Python limited to 5 elements. Implement Enqueue at the rear, Dequeue at the front, Peek at the front, and handle overflow and underflow conditions.',
    prerequisites: [
      {
        concept: 'FIFO (First In, First Out) Principle',
        explanation: 'A queue works on the FIFO principle: the first element added is the first one removed. Think of a line of people waiting for a bus ticket: the person who arrives first gets served first.',
        example: 'If 10 enters, then 20 enters, dequeue removes 10 first.'
      },
      {
        concept: 'Front and Rear Ends',
        explanation: 'Elements enter at the Rear (back) and leave from the Front. In this basic array implementation, rear is the end of the list and front is index 0.',
        example: 'Enqueue: append to end (rear). Dequeue: pop(0) from front.'
      }
    ],
    algorithm: [
      'Set MAX = 5 and create an empty list queue = [].',
      'Enqueue: Check if len(queue) == MAX. If true, print "Queue is Full" (Overflow); otherwise input value and append at rear (queue.append(value)).',
      'Dequeue: Check if len(queue) == 0. If true, print "Queue is Empty" (Underflow); otherwise remove and display queue.pop(0).',
      'Peek: Check if len(queue) == 0. If true, print "Queue is Empty"; otherwise display front element queue[0].',
      'Display: If empty print "Queue is Empty"; otherwise print queue from front to rear.',
      'Repeat until choice is 5 (Exit).'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'queue_array.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 4–5).',
        code: `MAX = 5
queue = []

while True:
    print("\\n1. Enqueue")
    print("2. Dequeue")
    print("3. Peek")
    print("4. Display")
    print("5. Exit")
    choice = int(input("Enter your choice: "))
    if choice == 1:
        if len(queue) == MAX:
            print("Queue is Full")
        else:
            value = int(input("Enter number to insert: "))
            queue.append(value)
            print("Queue:", queue)
    elif choice == 2:
        if len(queue) == 0:
            print("Queue is Empty")
        else:
            print("Deleted element:", queue.pop(0))
            print("Queue:", queue)
    elif choice == 3:
        if len(queue) == 0:
            print("Queue is Empty")
        else:
            print("Front element:", queue[0])
    elif choice == 4:
        if len(queue) == 0:
            print("Queue is Empty")
        else:
            print("Queue:", queue)
    elif choice == 5:
        break
    else:
        print("Invalid choice")`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Lines 1–2',
        codeSnippet: `MAX = 5\nqueue = []`,
        whatItDoes: 'Initializes maximum capacity (5) and empty list container.',
        whyNeeded: 'Limits queue size to 5.',
        contribution: 'Creates bounded queue state.'
      },
      {
        lineRange: 'Lines 13–19',
        codeSnippet: `if choice == 1:\n    if len(queue) == MAX:\n        print("Queue is Full")\n    else:\n        value = int(input("Enter number to insert: "))\n        queue.append(value)`,
        whatItDoes: 'Enqueue operation: checks for overflow, then appends to rear.',
        whyNeeded: 'Adds items to back of queue in O(1) time.',
        contribution: 'Inserts new item.'
      },
      {
        lineRange: 'Lines 20–26',
        codeSnippet: `elif choice == 2:\n    if len(queue) == 0:\n        print("Queue is Empty")\n    else:\n        print("Deleted element:", queue.pop(0))`,
        whatItDoes: 'Dequeue operation: checks for underflow, then removes front item via pop(0).',
        whyNeeded: 'Maintains FIFO order by removing oldest item.',
        contribution: 'Dequeues front element; takes O(n) due to left-shifting remaining elements.'
      },
      {
        lineRange: 'Lines 27–31',
        codeSnippet: `elif choice == 3:\n    if len(queue) == 0:\n        print("Queue is Empty")\n    else:\n        print("Front element:", queue[0])`,
        whatItDoes: 'Peek operation: views queue[0] without removing it.',
        whyNeeded: 'Allows inspecting the next element in line.',
        contribution: 'Returns front item in O(1) time.'
      }
    ],
    dryRun: {
      title: 'Enqueue and Dequeue FIFO Flow',
      description: 'Enqueueing 10, 20, 30 and dequeuing one element.',
      initialInput: 'Empty queue: []',
      steps: [
        {
          stepNumber: 1,
          action: 'Enqueue 10',
          stateOrVariables: 'queue = [10]',
          outputOrLog: 'Queue: [10]'
        },
        {
          stepNumber: 2,
          action: 'Enqueue 20',
          stateOrVariables: 'queue = [10, 20]',
          outputOrLog: 'Queue: [10, 20]'
        },
        {
          stepNumber: 3,
          action: 'Peek',
          stateOrVariables: 'queue[0] is 10',
          outputOrLog: 'Front element: 10'
        },
        {
          stepNumber: 4,
          action: 'Dequeue',
          stateOrVariables: 'queue.pop(0) removes 10; queue = [20]',
          outputOrLog: 'Deleted element: 10'
        }
      ],
      finalOutput: 'Queue: [20]'
    },
    sampleInput: `1 -> 100
1 -> 200
3
2
5`,
    sampleOutput: `Queue: [100]
Queue: [100, 200]
Front element: 100
Deleted element: 100
Queue: [200]`,
    timeComplexity: 'Enqueue: O(1) | Dequeue: O(n) | Peek: O(1) | Display: O(n)',
    spaceComplexity: 'O(MAX) = O(1) space',
    complexityExplanation: 'Enqueue appends to the end in O(1). Dequeue uses pop(0) which shifts all remaining n-1 elements leftward, taking O(n) time. (To achieve O(1) dequeue, a collections.deque or circular queue pointer approach is used in production).',
    result: 'The linear queue was successfully implemented with FIFO order verified.',
    conclusion: 'Linear queues process tasks in strict arrival order. Python pop(0) introduces linear shifting overhead.',
    vivaQuestions: [
      {
        id: 'dsa-v-3-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-3',
        question: 'Why does `pop(0)` in a Python list take O(n) time?',
        answer: 'Because Python lists are contiguous arrays in memory. When the first element at index 0 is removed, every remaining element from index 1 to n-1 must be shifted left by one index.',
        category: 'viva'
      },
      {
        id: 'dsa-v-3-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-3',
        question: 'How can a queue achieve O(1) for both enqueue and dequeue?',
        answer: 'By using a Circular Queue with front and rear integer pointers, or a doubly linked list / collections.deque in Python which uses linked memory blocks.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Queue is FIFO: First In, First Out.',
        'Enqueue inserts at Rear (`append()`), Dequeue removes from Front (`pop(0)`).',
        'Peek inspects `queue[0]`.',
        'pop(0) causes O(n) shifting in a Python list.'
      ],
      commonPitfalls: [
        'Calling pop(0) on an empty list throws IndexError if underflow check is missing.',
        'Confusing front with rear.'
      ],
      examTips: [
        'In viva, explain why a Circular Queue is preferred over a linear array queue (prevents unused memory gaps).'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '4–5'
    }
  },
  {
    id: 'dsa-exp-4',
    subjectId: 'dsa',
    expNumber: 4,
    title: 'Singly Linked List (Insert, Delete, Display)',
    topic: 'Linked List',
    chapter: 'Experiment 4',
    aim: 'To implement a singly linked list and perform insertion and deletion at the beginning and at the end, and display the list.',
    problemStatement: 'Construct a node-based singly linked list in Python. Implement insert_beginning, insert_end, delete_beginning, delete_end, and list display with pointer tracking.',
    prerequisites: [
      {
        concept: 'Node & Pointer Anatomy',
        explanation: 'A Node is an object containing two fields: `data` (the stored value) and `next` (a reference/pointer to the next node in sequence, or None if it is the last node).',
        example: 'class Node: self.data = data; self.next = None'
      },
      {
        concept: 'Head Pointer',
        explanation: 'The `head` pointer holds the reference to the first node of the list. If head is None, the list is empty. Traversing requires following `.next` pointers until reaching None.',
        example: 'head -> [10 | next] -> [20 | next] -> [30 | None]'
      }
    ],
    algorithm: [
      'Define a Node class with data and next attributes; set head = None.',
      'Insert at Beginning: Create new Node(value). Set new_node.next = head; update head = new_node.',
      'Insert at End: Create new Node(value). If head is None, set head = new_node. Else traverse with pointer temp until temp.next is None; set temp.next = new_node.',
      'Delete from Beginning: If head is None, print "List is Empty". Else advance head to head.next.',
      'Delete from End: If head is None, print "List is Empty". If head.next is None, set head = None. Else traverse until temp.next.next is None, then disconnect last node with temp.next = None.',
      'Display: Start from head, iterate printing temp.data, advance temp = temp.next until temp is None.',
      'Repeat menu until choice is 6 (Exit).'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'singly_linked_list.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 5–8).',
        code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

head = None

def insert_beginning(value):
    global head
    new_node = Node(value)
    new_node.next = head
    head = new_node

def insert_end(value):
    global head
    new_node = Node(value)
    if head is None:
        head = new_node
        return
    temp = head
    while temp.next:
        temp = temp.next
    temp.next = new_node

def delete_beginning():
    global head
    if head is None:
        print("List is Empty")
    else:
        head = head.next

def delete_end():
    global head
    if head is None:
        print("List is Empty")
    elif head.next is None:
        head = None
    else:
        temp = head
        while temp.next.next:
            temp = temp.next
        temp.next = None

def display():
    temp = head
    if temp is None:
        print("List is Empty")
        return
    while temp:
        print(temp.data, end=" ")
        temp = temp.next
    print()

while True:
    print("\\n1. Insert at Beginning")
    print("2. Insert at End")
    print("3. Delete from Beginning")
    print("4. Delete from End")
    print("5. Display")
    print("6. Exit")
    choice = int(input("Enter your choice: "))
    if choice == 1:
        value = int(input("Enter number: "))
        insert_beginning(value)
        display()
    elif choice == 2:
        value = int(input("Enter number: "))
        insert_end(value)
        display()
    elif choice == 3:
        delete_beginning()
        display()
    elif choice == 4:
        delete_end()
        display()
    elif choice == 5:
        display()
    elif choice == 6:
        break
    else:
        print("Invalid choice")`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Lines 1–4',
        codeSnippet: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None`,
        whatItDoes: 'Defines the blueprint for a node containing data and a next pointer initialized to None.',
        whyNeeded: 'Linked lists are formed by chaining Node instances together dynamically.',
        contribution: 'Base unit of the linked structure.'
      },
      {
        lineRange: 'Lines 8–12',
        codeSnippet: `def insert_beginning(value):\n    global head\n    new_node = Node(value)\n    new_node.next = head\n    head = new_node`,
        whatItDoes: 'Inserts a new node at the front in O(1) time.',
        whyNeeded: 'Connects new_node.next to the existing head, then points head to new_node.',
        contribution: 'Constant-time insertion at head.'
      },
      {
        lineRange: 'Lines 14–23',
        codeSnippet: `def insert_end(value):\n    global head\n    new_node = Node(value)\n    if head is None:\n        head = new_node\n        return\n    temp = head\n    while temp.next:\n        temp = temp.next\n    temp.next = new_node`,
        whatItDoes: 'Traverses to the last node (where temp.next is None) and links new_node.',
        whyNeeded: 'Appends data to tail.',
        conditionOrOperation: 'while temp.next: stops at the last node rather than falling off the end.',
        contribution: 'O(n) tail insertion.'
      },
      {
        lineRange: 'Lines 32–42',
        codeSnippet: `def delete_end():\n    global head\n    if head is None:\n        print("List is Empty")\n    elif head.next is None:\n        head = None\n    else:\n        temp = head\n        while temp.next.next:\n            temp = temp.next\n        temp.next = None`,
        whatItDoes: 'Deletes the last node by finding the second-to-last node and severing temp.next.',
        whyNeeded: 'Requires stopping at the second-to-last node (temp.next.next is None) to set its next to None.',
        contribution: 'Removes tail node safely.'
      }
    ],
    dryRun: {
      title: 'Linked List Node Linking Trace',
      description: 'Insert 10 at beginning, 20 at end, and delete from beginning.',
      initialInput: 'head = None',
      steps: [
        {
          stepNumber: 1,
          action: 'insert_beginning(10)',
          stateOrVariables: 'new_node = Node(10), next = None. head = new_node',
          outputOrLog: '10'
        },
        {
          stepNumber: 2,
          action: 'insert_end(20)',
          stateOrVariables: 'temp stops at Node(10); Node(10).next = Node(20)',
          outputOrLog: '10 20'
        },
        {
          stepNumber: 3,
          action: 'delete_beginning()',
          stateOrVariables: 'head = head.next -> points to Node(20)',
          outputOrLog: '20'
        }
      ],
      finalOutput: 'Linked List: 20'
    },
    sampleInput: `1 -> 10
2 -> 20
1 -> 5
3
5
6`,
    sampleOutput: `5 10 20
10 20
10 20`,
    timeComplexity: 'Beginning Insert/Delete: O(1) | End Insert/Delete: O(n) | Display: O(n)',
    spaceComplexity: 'O(n) where each node stores one pointer and one value',
    complexityExplanation: 'Operating at the head is O(1) because we have a direct pointer to it. Operating at the end without a tail pointer requires traversing n nodes, taking O(n) time.',
    result: 'The singly linked list was successfully created and manipulated with pointer updates.',
    conclusion: 'Linked lists allow dynamic memory allocation without pre-allocated limits, avoiding contiguous array shifting costs.',
    vivaQuestions: [
      {
        id: 'dsa-v-4-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-4',
        question: 'Why do we check `temp.next.next` when deleting from the end of a singly linked list?',
        answer: 'Because in a singly linked list, we cannot move backwards. To delete the last node, we must reach the second-to-last node and set its `.next` pointer to None. Checking `temp.next.next` ensures we stop exactly at the second-to-last node.',
        category: 'viva'
      },
      {
        id: 'dsa-v-4-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-4',
        question: 'What is the main advantage of a Linked List over an Array?',
        answer: 'Linked lists have dynamic size (nodes are allocated individually in heap memory as needed) and permit O(1) insertions/deletions at the head without shifting existing elements.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Each node has `data` and `next`.',
        '`head` points to the start of the chain.',
        'Insert at beginning is O(1): `new.next = head; head = new`.',
        'End operations without a tail pointer are O(n).'
      ],
      commonPitfalls: [
        'Losing reference to the list by overwriting `head` before linking `new_node.next`.',
        'Dereferencing `temp.next.next` when the list has fewer than 2 nodes.'
      ],
      examTips: [
        'Draw the pointer arrows on paper during viva: showing how head moves is the best way to explain.'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '5–8'
    }
  },
  {
    id: 'dsa-exp-5',
    subjectId: 'dsa',
    expNumber: 5,
    title: 'Doubly Linked List (Insert, Delete, Display)',
    topic: 'Linked List',
    chapter: 'Experiment 5',
    aim: 'To implement a doubly linked list and perform insertion and deletion at the beginning and at the end, and display the list.',
    problemStatement: 'Construct a doubly linked list in Python where each node contains pointers to both its predecessor and successor. Implement beginning and end insertions/deletions and forward display.',
    prerequisites: [
      {
        concept: 'Bidirectional Links',
        explanation: 'A doubly linked list node has three fields: `prev` (pointer to previous node), `data` (stored value), and `next` (pointer to next node). This allows traversing forwards and backwards.',
        example: '[None <- prev | 10 | next ->] <===> [<- prev | 20 | next -> None]'
      },
      {
        concept: 'Two-Way Pointer Updates',
        explanation: 'Whenever a node is inserted or deleted, both `prev` and `next` pointers must be maintained on adjacent nodes to preserve bidirectional integrity.',
        example: 'new_node.next = head; head.prev = new_node; head = new_node'
      }
    ],
    algorithm: [
      'Define a Node class with prev, data, and next; initialize head = None.',
      'Insert at Beginning: Create new Node(value). Set new.next = head. If head exists, set head.prev = new. Update head = new.',
      'Insert at End: Create new Node(value). If head is None, head = new. Else traverse to last node (temp.next is None); set temp.next = new and new.prev = temp.',
      'Delete from Beginning: If head is None print "List is Empty". Set head = head.next. If head exists, set head.prev = None.',
      'Delete from End: If head is None print "List is Empty". If head.next is None, set head = None. Else traverse to last node; sever connection using temp.prev.next = None.',
      'Display: Iterate from head through next pointers, printing data values.',
      'Repeat menu until choice is 6 (Exit).'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'doubly_linked_list.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 8–11).',
        code: `class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None

head = None

def insert_beginning(value):
    global head
    new_node = Node(value)
    new_node.next = head
    if head is not None:
        head.prev = new_node
    head = new_node

def insert_end(value):
    global head
    new_node = Node(value)
    if head is None:
        head = new_node
        return
    temp = head
    while temp.next:
        temp = temp.next
    temp.next = new_node
    new_node.prev = temp

def delete_beginning():
    global head
    if head is None:
        print("List is Empty")
        return
    head = head.next
    if head is not None:
        head.prev = None

def delete_end():
    global head
    if head is None:
        print("List is Empty")
        return
    if head.next is None:
        head = None
        return
    temp = head
    while temp.next:
        temp = temp.next
    temp.prev.next = None

def display():
    temp = head
    if temp is None:
        print("List is Empty")
        return
    while temp:
        print(temp.data, end=" ")
        temp = temp.next
    print()

while True:
    print("\\n1. Insert at Beginning")
    print("2. Insert at End")
    print("3. Delete from Beginning")
    print("4. Delete from End")
    print("5. Display")
    print("6. Exit")
    choice = int(input("Enter your choice: "))
    if choice == 1:
        value = int(input("Enter number: "))
        insert_beginning(value)
        display()
    elif choice == 2:
        value = int(input("Enter number: "))
        insert_end(value)
        display()
    elif choice == 3:
        delete_beginning()
        display()
    elif choice == 4:
        delete_end()
        display()
    elif choice == 5:
        display()
    elif choice == 6:
        break
    else:
        print("Invalid choice")`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Lines 1–5',
        codeSnippet: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.prev = None\n        self.next = None`,
        whatItDoes: 'Initializes a node with prev, data, and next pointer fields.',
        whyNeeded: 'Enables bidirectional navigation.',
        contribution: 'Node foundation.'
      },
      {
        lineRange: 'Lines 9–16',
        codeSnippet: `def insert_beginning(value):\n    global head\n    new_node = Node(value)\n    new_node.next = head\n    if head is not None:\n        head.prev = new_node\n    head = new_node`,
        whatItDoes: 'Attaches new node at front and binds old head prev pointer back to new node.',
        whyNeeded: 'Both directions must be linked.',
        contribution: 'O(1) beginning insertion.'
      },
      {
        lineRange: 'Lines 41–51',
        codeSnippet: `def delete_end():\n    # ...\n    temp = head\n    while temp.next:\n        temp = temp.next\n    temp.prev.next = None`,
        whatItDoes: 'Walks to the final node and severs it using its prev pointer (temp.prev.next = None).',
        whyNeeded: 'Notice that unlike singly linked list, there is no need for a temp.next.next check because prev pointer allows reaching the preceding node directly!',
        contribution: 'Clean deletion from end.'
      }
    ],
    dryRun: {
      title: 'Doubly Linked List Bidirectional Pointer Trace',
      description: 'Insert 10, then 20 at end, then delete beginning.',
      initialInput: 'head = None',
      steps: [
        {
          stepNumber: 1,
          action: 'insert_beginning(10)',
          stateOrVariables: 'head points to Node(10), prev=None, next=None',
          outputOrLog: '10'
        },
        {
          stepNumber: 2,
          action: 'insert_end(20)',
          stateOrVariables: 'Node(10).next = Node(20); Node(20).prev = Node(10)',
          outputOrLog: '10 20'
        },
        {
          stepNumber: 3,
          action: 'delete_beginning()',
          stateOrVariables: 'head = head.next (Node(20)); Node(20).prev = None',
          outputOrLog: '20'
        }
      ],
      finalOutput: '20'
    },
    sampleInput: `1 -> 10
2 -> 20
2 -> 30
4
5
6`,
    sampleOutput: `10
10 20
10 20 30
10 20
10 20`,
    timeComplexity: 'Beginning Insert/Delete: O(1) | End Insert/Delete: O(n) without tail | Space: O(n)',
    spaceComplexity: 'O(n) auxiliary space with 2 pointers per node',
    complexityExplanation: 'Beginning operations take O(1). End operations take O(n) because no tail pointer is stored, requiring traversing from head to tail.',
    result: 'Doubly linked list was successfully implemented with bidirectional pointer management verified.',
    conclusion: 'Doubly linked lists simplify backwards traversal and deletion of a given node, at the cost of an extra pointer per node.',
    vivaQuestions: [
      {
        id: 'dsa-v-5-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-5',
        question: 'What is the main advantage of a Doubly Linked List over a Singly Linked List?',
        answer: 'A doubly linked list allows bidirectional traversal (both forward and backward) and allows deleting a given node in O(1) time if a pointer to that node is already known, because its predecessor can be reached immediately via `node.prev`.',
        category: 'viva'
      },
      {
        id: 'dsa-v-5-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-5',
        question: 'What is the memory trade-off in a Doubly Linked List?',
        answer: 'Every node requires an extra pointer (`prev`), consuming additional memory compared to a singly linked list node.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Node has three components: `prev`, `data`, `next`.',
        'When inserting, update both `next` of predecessor and `prev` of successor.',
        'Delete at end is simplified: walk to last node and execute `temp.prev.next = None`.'
      ],
      commonPitfalls: [
        'Forgetting to set `head.prev = None` when deleting the first node, leaving a dangling pointer.'
      ],
      examTips: [
        'Highlight the difference between deleting the end in singly vs doubly: doubly does not require `temp.next.next`.'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '8–11'
    }
  },
  {
    id: 'dsa-exp-6',
    subjectId: 'dsa',
    expNumber: 6,
    title: 'Insertion Sort Algorithm',
    topic: 'Sorting',
    chapter: 'Experiment 6',
    aim: 'To sort a list of numbers in ascending order using the Insertion Sort algorithm.',
    problemStatement: 'Implement the in-place Insertion Sort algorithm in Python to sort an array of integers in ascending order. Incrementally insert each element into its sorted left sub-array.',
    prerequisites: [
      {
        concept: 'Sorted vs Unsorted Partition',
        explanation: 'Insertion sort splits the array into two logical sections: the sorted left section (initially just element 0) and the unsorted right section. In each pass, the first unsorted element (`key`) is taken and inserted into its proper place in the sorted section.',
        example: 'Like arranging playing cards in your hand: you take each new card and slide it into order among the cards already sorted.'
      },
      {
        concept: 'Right-Shifting Elements',
        explanation: 'Instead of swapping repeatedly, elements larger than `key` are shifted one position to the right to create an opening for `key`.',
        example: 'If sorted is [10, 30] and key is 20, 30 shifts right to index 2, and 20 is placed at index 1.'
      }
    ],
    algorithm: [
      'Read array elements from user as space-separated integers.',
      'Iterate from index i = 1 to len(arr) - 1: store current element in variable key = arr[i] and set j = i - 1.',
      'While j >= 0 and arr[j] > key: shift arr[j] one position right (arr[j + 1] = arr[j]) and decrement j by 1.',
      'Place key into the vacated position: arr[j + 1] = key.',
      'Print the fully sorted array.'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'insertion_sort.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Page 11). Clean and canonical in-place insertion sort.',
        code: `arr = list(map(int, input("Enter array elements: ").split()))

for i in range(1, len(arr)):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j -= 1
    arr[j + 1] = key

print("Sorted array:", arr)`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Line 1',
        codeSnippet: `arr = list(map(int, input("Enter array elements: ").split()))`,
        whatItDoes: 'Reads integers into list arr.',
        whyNeeded: 'Input vector.',
        contribution: 'Creates unsorted dataset.'
      },
      {
        lineRange: 'Line 3',
        codeSnippet: `for i in range(1, len(arr)):`,
        whatItDoes: 'Loops from the second element (index 1) to the last element.',
        whyNeeded: 'A single element at index 0 is trivially sorted by definition.',
        contribution: 'Controls outer passes (n - 1 passes).'
      },
      {
        lineRange: 'Lines 4–5',
        codeSnippet: `key = arr[i]\nj = i - 1`,
        whatItDoes: 'Picks element arr[i] to insert into sorted left part, and sets j to immediate left index.',
        whyNeeded: 'Saves the value so that subsequent shifts do not overwrite it.',
        contribution: 'Prepares for shift comparison.'
      },
      {
        lineRange: 'Lines 6–8',
        codeSnippet: `while j >= 0 and arr[j] > key:\n    arr[j + 1] = arr[j]\n    j -= 1`,
        whatItDoes: 'Shifts every element in sorted portion that is strictly greater than key one step to the right.',
        whyNeeded: 'Creates space at the correct ascending rank.',
        conditionOrOperation: 'j >= 0 prevents negative index; arr[j] > key stops once correct position is reached.',
        contribution: 'Linear shift loop.'
      },
      {
        lineRange: 'Line 9',
        codeSnippet: `arr[j + 1] = key`,
        whatItDoes: 'Inserts key into the opened position.',
        whyNeeded: 'Completes insertion for pass i.',
        contribution: 'Expands sorted partition by 1.'
      }
    ],
    dryRun: {
      title: 'Insertion Sort Step-by-Step Trace',
      description: 'Sorting array [12, 11, 13, 5, 6].',
      initialInput: 'Array: [12, 11, 13, 5, 6]',
      steps: [
        {
          stepNumber: 1,
          action: 'Pass 1 (i = 1, key = 11)',
          stateOrVariables: '12 > 11: shift 12 to index 1. Place 11 at index 0.',
          outputOrLog: '[11, 12, 13, 5, 6]'
        },
        {
          stepNumber: 2,
          action: 'Pass 2 (i = 2, key = 13)',
          stateOrVariables: '12 <= 13: no shift. 13 stays at index 2.',
          outputOrLog: '[11, 12, 13, 5, 6]'
        },
        {
          stepNumber: 3,
          action: 'Pass 3 (i = 3, key = 5)',
          stateOrVariables: '13 > 5, 12 > 5, 11 > 5: shift 13, 12, 11 right. Place 5 at index 0.',
          outputOrLog: '[5, 11, 12, 13, 6]'
        },
        {
          stepNumber: 4,
          action: 'Pass 4 (i = 4, key = 6)',
          stateOrVariables: '13 > 6, 12 > 6, 11 > 6: shift right. Place 6 at index 1.',
          outputOrLog: '[5, 6, 11, 12, 13]'
        }
      ],
      finalOutput: 'Sorted array: [5, 6, 11, 12, 13]'
    },
    sampleInput: `Enter array elements: 64 34 25 12 22 11 90`,
    sampleOutput: `Sorted array: [11, 12, 22, 25, 34, 64, 90]`,
    timeComplexity: 'Best Case: O(n) | Worst Case: O(n²) | Average Case: O(n²)',
    spaceComplexity: 'O(1) auxiliary space (in-place sort)',
    complexityExplanation: 'Best case occurs when array is already sorted (inner while loop never executes, taking O(n) comparisons). Worst case occurs when array is sorted in reverse order (every element must be shifted through the entire sorted section, taking n*(n-1)/2 comparisons ~ O(n²)).',
    result: 'The array elements were successfully sorted in ascending order using insertion sort.',
    conclusion: 'Insertion sort is an efficient, stable, in-place sorting algorithm for small or nearly sorted datasets.',
    vivaQuestions: [
      {
        id: 'dsa-v-6-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-6',
        question: 'Under what condition does Insertion Sort achieve its best-case time complexity of O(n)?',
        answer: 'When the array is already sorted in ascending order. In each pass, the first comparison `arr[j] > key` fails immediately, causing zero shifts and exactly n - 1 comparisons.',
        category: 'viva'
      },
      {
        id: 'dsa-v-6-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-6',
        question: 'Is Insertion Sort stable and in-place?',
        answer: 'Yes. It is in-place because it requires only O(1) auxiliary memory. It is stable because elements with equal keys maintain their relative order (due to the strict inequality `arr[j] > key`).',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Outer loop runs from index 1 to n-1.',
        '`key` holds current element, `j` shifts preceding elements rightward.',
        'Best case: O(n) when already sorted; Worst case: O(n²) when reverse sorted.',
        'Stable and in-place.'
      ],
      commonPitfalls: [
        'Writing `arr[j] >= key` instead of `arr[j] > key` breaks algorithm stability for identical values.'
      ],
      examTips: [
        'Remember the playing cards analogy — it demonstrates clear intuitive understanding to the examiner.'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '11'
    }
  },
  {
    id: 'dsa-exp-7',
    subjectId: 'dsa',
    expNumber: 7,
    title: 'Binary Search Tree (BST) & Traversals',
    topic: 'Trees',
    chapter: 'Experiment 7',
    aim: 'To construct a Binary Search Tree (BST) and perform insertion, sideways tree display, and Inorder, Preorder, and Postorder traversals.',
    problemStatement: 'Write a Python program to build a Binary Search Tree from user input. Implement recursive insertion adhering to the BST property, a sideways rotated 90-degree visual tree printer, and standard depth-first traversals (Inorder, Preorder, Postorder).',
    prerequisites: [
      {
        concept: 'Binary Search Tree Property',
        explanation: 'For every node X in a BST: all values in the left subtree of X are strictly smaller than X.data, and all values in the right subtree of X are strictly greater than X.data. Duplicates are typically ignored.',
        example: 'If root is 50, 30 goes to the left subtree, and 70 goes to the right subtree.'
      },
      {
        concept: 'Tree Traversals Order',
        explanation: '1. Inorder: Left -> Root -> Right (produces sorted ascending sequence!).\n2. Preorder: Root -> Left -> Right (used for copying or serializing trees).\n3. Postorder: Left -> Right -> Root (used for deleting or bottom-up evaluations).',
        example: 'Inorder of BST [50, 30, 70] is 30, 50, 70.'
      }
    ],
    algorithm: [
      'Define Node class with data, left = None, and right = None.',
      'Insert(root, value): If root is None, return Node(value). If value < root.data, root.left = insert(root.left, value). If value > root.data, root.right = insert(root.right, value). Return root.',
      'Display(root, space=0): If root is None return. Increase space by 5. Recursively display right subtree. Print spaces and root.data. Recursively display left subtree (prints tree rotated 90°).',
      'Inorder(root): If root is not None: traverse left, print root.data, traverse right.',
      'Preorder(root): If root is not None: print root.data, traverse left, traverse right.',
      'Postorder(root): If root is not None: traverse left, traverse right, print root.data.',
      'Prompt user for count n and values, construct BST, and display tree with all 3 traversals.'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'binary_search_tree.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 12–13). Includes recursive insertion, 90-degree rotated display, and all three traversals.',
        code: `class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.data:
        root.left = insert(root.left, value)
    elif value > root.data:
        root.right = insert(root.right, value)
    return root

def display(root, space=0):
    if root is None:
        return
    space += 5
    display(root.right, space)
    print()
    print(" " * space + str(root.data))
    display(root.left, space)

def inorder(root):
    if root is not None:
        inorder(root.left)
        print(root.data, end=" ")
        inorder(root.right)

def preorder(root):
    if root is not None:
        print(root.data, end=" ")
        preorder(root.left)
        preorder(root.right)

def postorder(root):
    if root is not None:
        postorder(root.left)
        postorder(root.right)
        print(root.data, end=" ")

root = None
n = int(input("How many nodes do you want to insert? "))
for i in range(n):
    value = int(input(f"Enter value for node {i + 1}: "))
    root = insert(root, value)

print("\\nConstructed Binary Search Tree:")
display(root)
print("\\n\\nInorder Traversal:")
inorder(root)
print("\\n\\nPreorder Traversal:")
preorder(root)
print("\\n\\nPostorder Traversal:")
postorder(root)`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Lines 7–14',
        codeSnippet: `def insert(root, value):\n    if root is None:\n        return Node(value)\n    if value < root.data:\n        root.left = insert(root.left, value)\n    elif value > root.data:\n        root.right = insert(root.right, value)\n    return root`,
        whatItDoes: 'Recursively locates the proper leaf position for value according to the BST rule.',
        whyNeeded: 'Guarantees smaller items reside in left subtree and larger items in right subtree.',
        conditionOrOperation: 'if root is None: base case that creates new Node. Recursive calls update parent child links.',
        contribution: 'Maintains BST structural invariants.'
      },
      {
        lineRange: 'Lines 16–23',
        codeSnippet: `def display(root, space=0):\n    if root is None:\n        return\n    space += 5\n    display(root.right, space)\n    print()\n    print(" " * space + str(root.data))\n    display(root.left, space)`,
        whatItDoes: 'Prints the tree sideways (rotated 90 degrees counter-clockwise).',
        whyNeeded: 'Right subtree is printed on top with indentation, root on left edge, left subtree at bottom.',
        contribution: 'Enables quick terminal visualization of the tree hierarchy.'
      },
      {
        lineRange: 'Lines 25–29',
        codeSnippet: `def inorder(root):\n    if root is not None:\n        inorder(root.left)\n        print(root.data, end=" ")\n        inorder(root.right)`,
        whatItDoes: 'Traverses Left -> Root -> Right.',
        whyNeeded: 'Always outputs elements in ascending sorted order for a BST.',
        contribution: 'Standard sorted tree traversal.'
      }
    ],
    dryRun: {
      title: 'BST Construction and Inorder Sorting',
      description: 'Inserting nodes 50, 30, 70, 20, 40.',
      initialInput: 'Values: 50 30 70 20 40',
      steps: [
        {
          stepNumber: 1,
          action: 'Insert 50',
          stateOrVariables: 'root = Node(50)',
          outputOrLog: 'Tree has root 50'
        },
        {
          stepNumber: 2,
          action: 'Insert 30',
          stateOrVariables: '30 < 50: goes to left. root.left = Node(30)',
          outputOrLog: 'Left child of 50 is 30'
        },
        {
          stepNumber: 3,
          action: 'Insert 70',
          stateOrVariables: '70 > 50: goes to right. root.right = Node(70)',
          outputOrLog: 'Right child of 50 is 70'
        },
        {
          stepNumber: 4,
          action: 'Insert 20',
          stateOrVariables: '20 < 50 -> left (30); 20 < 30 -> left. Node(30).left = Node(20)',
          outputOrLog: 'Left child of 30 is 20'
        },
        {
          stepNumber: 5,
          action: 'Insert 40',
          stateOrVariables: '40 < 50 -> left (30); 40 > 30 -> right. Node(30).right = Node(40)',
          outputOrLog: 'Right child of 30 is 40'
        }
      ],
      finalOutput: 'Inorder (Sorted): 20 30 40 50 70'
    },
    sampleInput: `How many nodes do you want to insert? 5
Enter value for node 1: 50
Enter value for node 2: 30
Enter value for node 3: 70
Enter value for node 4: 20
Enter value for node 5: 40`,
    sampleOutput: `Constructed Binary Search Tree:
          70

     50

          40

     30

          20

Inorder Traversal:
20 30 40 50 70 

Preorder Traversal:
50 30 20 40 70 

Postorder Traversal:
20 40 30 70 50`,
    timeComplexity: 'Insertion: O(h) where h is height (O(log n) balanced, O(n) worst case) | Traversals: O(n)',
    spaceComplexity: 'O(h) call stack memory during recursion',
    complexityExplanation: 'In a balanced BST, height is ~log2(n). In a skewed tree (e.g. inserting 1, 2, 3, 4, 5 in order), the tree degenerates into a linked list of height n, yielding O(n) time.',
    result: 'The Binary Search Tree was successfully constructed and verified via Inorder, Preorder, and Postorder traversals.',
    conclusion: 'Inorder traversal of a BST consistently yields a sorted sequence of values in O(n) time.',
    vivaQuestions: [
      {
        id: 'dsa-v-7-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-7',
        question: 'Why does the Inorder traversal of a BST always print elements in sorted order?',
        answer: 'Because Inorder visits: (1) All elements in the left subtree (which are strictly smaller than root), then (2) the root itself, then (3) all elements in the right subtree (which are strictly larger than root). Recursively applying this rule guarantees ascending order.',
        category: 'viva'
      },
      {
        id: 'dsa-v-7-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-7',
        question: 'What is a skewed binary tree and what is its search complexity?',
        answer: 'A skewed tree occurs when every node has only a single child (e.g. inserting already sorted elements). It degenerates into a linear linked list where search complexity degrades from O(log n) to O(n). Self-balancing trees (AVL, Red-Black) prevent this.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'BST Property: Left < Root < Right.',
        'Inorder: Left -> Root -> Right (Sorted).',
        'Preorder: Root -> Left -> Right.',
        'Postorder: Left -> Right -> Root.',
        'Height is O(log n) when balanced, O(n) when skewed.'
      ],
      commonPitfalls: [
        'Forgetting that inserting already sorted numbers into a vanilla BST creates an O(n) degenerate linked list.'
      ],
      examTips: [
        'Whenever an exam question asks "Which traversal gives sorted output for a BST?", the answer is always INORDER.'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '12–13'
    }
  },
  {
    id: 'dsa-exp-8',
    subjectId: 'dsa',
    expNumber: 8,
    title: 'Breadth First Search (BFS) Traversal on Graph',
    topic: 'Graphs',
    chapter: 'Experiment 8',
    aim: 'To implement a Breadth First Search (BFS) traversal on an undirected graph and display the vertices visited in order.',
    problemStatement: 'Construct a graph using an adjacency list (dictionary of lists in Python). Implement an interactive menu to add undirected edges, display the adjacency list, and perform BFS traversal level-by-level using a FIFO queue and a visited set.',
    prerequisites: [
      {
        concept: 'Graph Representation (Adjacency List)',
        explanation: 'A graph G = (V, E) is represented in Python using a dictionary where keys are vertices and values are lists of adjacent neighbor vertices.',
        example: 'graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A"], "D": ["B"]}'
      },
      {
        concept: 'BFS Exploration Strategy',
        explanation: 'BFS explores the graph level-by-level like concentric ripples in a pond: first visit the starting vertex (level 0), then all immediate neighbors (level 1), then their neighbors (level 2), using a FIFO queue. A `visited` set ensures cycles do not cause infinite loops.',
        example: 'From A with neighbors B and C, BFS visits A -> B -> C before moving to neighbors of B.'
      }
    ],
    algorithm: [
      'Initialize graph as an empty dictionary graph = {}.',
      'Add Edge (u, v): If u not in graph, set graph[u] = []. If v not in graph, set graph[v] = []. Append v to graph[u] and u to graph[v] (for undirected graph).',
      'BFS(start): Check if start is in graph. Create visited = set() and queue = deque([start]). Mark start as visited.',
      'While queue is not empty: pop vertex = queue.popleft(), print vertex, then iterate through graph.get(vertex, []). For each unvisited neighbor: mark visited and append to queue.',
      'Menu allows: 1. Add Edge, 2. BFS Traversal, 3. Display Graph, 4. Exit.'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'graph_bfs.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 13–15).',
        code: `from collections import deque

graph = {}

def add_edge(u, v):
    if u not in graph:
        graph[u] = []
    if v not in graph:
        graph[v] = []
    graph[u].append(v)
    graph[v].append(u)

def bfs(start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    while queue:
        vertex = queue.popleft()
        print(vertex, end=" ")
        for neighbour in graph.get(vertex, []):
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(neighbour)
    print()

while True:
    print("\\n1. Add Edge")
    print("2. BFS Traversal")
    print("3. Display Graph")
    print("4. Exit")
    choice = int(input("Enter your choice: "))
    if choice == 1:
        u = input("Enter first vertex: ")
        v = input("Enter second vertex: ")
        add_edge(u, v)
    elif choice == 2:
        start = input("Enter starting vertex: ")
        if start in graph:
            print("BFS Traversal:")
            bfs(start)
        else:
            print("Vertex not found")
    elif choice == 3:
        print(graph)
    elif choice == 4:
        break
    else:
        print("Invalid choice")`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Line 1',
        codeSnippet: `from collections import deque`,
        whatItDoes: 'Imports double-ended queue providing O(1) pops from the left.',
        whyNeeded: 'Standard list pop(0) takes O(n), whereas deque.popleft() takes O(1).',
        contribution: 'Optimal queue performance.'
      },
      {
        lineRange: 'Lines 5–11',
        codeSnippet: `def add_edge(u, v):\n    if u not in graph:\n        graph[u] = []\n    if v not in graph:\n        graph[v] = []\n    graph[u].append(v)\n    graph[v].append(u)`,
        whatItDoes: 'Adds an undirected edge connecting u and v symmetrically.',
        whyNeeded: 'Undirected edges must be traversable in both directions.',
        contribution: 'Populates adjacency list.'
      },
      {
        lineRange: 'Lines 13–24',
        codeSnippet: `def bfs(start):\n    visited = set()\n    queue = deque([start])\n    visited.add(start)\n    while queue:\n        vertex = queue.popleft()\n        print(vertex, end=" ")\n        for neighbour in graph.get(vertex, []):\n            if neighbour not in visited:\n                visited.add(neighbour)\n                queue.append(neighbour)`,
        whatItDoes: 'Core BFS algorithm using FIFO queue and visited set.',
        whyNeeded: 'Ensures level-by-level exploration and avoids visiting any node twice.',
        conditionOrOperation: 'if neighbour not in visited: prevents infinite cycles in cyclical graphs.',
        contribution: 'Traverses connected component.'
      }
    ],
    dryRun: {
      title: 'BFS Traversal Level-by-Level Trace',
      description: 'Graph with edges (A-B), (A-C), (B-D), (C-E). Start at A.',
      initialInput: 'Edges: A-B, A-C, B-D, C-E',
      steps: [
        {
          stepNumber: 1,
          action: 'Start at A (Level 0)',
          stateOrVariables: 'queue = [A], visited = {A}',
          outputOrLog: 'Pop A -> print "A". Neighbors: B, C added to queue.'
        },
        {
          stepNumber: 2,
          action: 'Visit Level 1 (B, C)',
          stateOrVariables: 'queue = [B, C], visited = {A, B, C}',
          outputOrLog: 'Pop B -> print "B". Neighbor D added to queue.'
        },
        {
          stepNumber: 3,
          action: 'Continue Level 1 (C)',
          stateOrVariables: 'queue = [C, D], visited = {A, B, C, D}',
          outputOrLog: 'Pop C -> print "C". Neighbor E added to queue.'
        },
        {
          stepNumber: 4,
          action: 'Visit Level 2 (D, E)',
          stateOrVariables: 'queue = [D, E], visited = {A, B, C, D, E}',
          outputOrLog: 'Pop D -> print "D". Pop E -> print "E". Queue empty.'
        }
      ],
      finalOutput: 'Visited Order: A B C D E'
    },
    sampleInput: `1 -> A, B
1 -> A, C
1 -> B, D
1 -> C, E
2 -> A
4`,
    sampleOutput: `BFS Traversal:
A B C D E`,
    timeComplexity: 'Time Complexity: O(V + E) | Space Complexity: O(V)',
    spaceComplexity: 'O(V) to store the visited set and FIFO queue',
    complexityExplanation: 'Every vertex is enqueued and dequeued at most once (O(V)). Every edge is examined twice for undirected graphs (O(E)). Thus total time is O(V + E).',
    result: 'The Breadth First Search traversal on the undirected graph was successfully executed.',
    conclusion: 'BFS guarantees finding the shortest path in an unweighted graph because it explores all vertices at distance d before moving to distance d + 1.',
    vivaQuestions: [
      {
        id: 'dsa-v-8-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-8',
        question: 'Why does BFS require a Queue while DFS uses a Stack or Recursion?',
        answer: 'BFS must explore vertices in order of their distance from the source (FIFO - level by level), which matches Queue semantics. DFS explores as deep as possible along a branch before backtracking (LIFO), which matches Stack semantics.',
        category: 'viva'
      },
      {
        id: 'dsa-v-8-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-8',
        question: 'What happens if we remove the `visited` set from BFS on a cyclic graph?',
        answer: 'The algorithm will enter an infinite loop because vertices in a cycle will repeatedly enqueue each other continuously until memory runs out.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'BFS uses a FIFO Queue (`collections.deque`).',
        'Visits vertices level by level.',
        'Requires a `visited` set to avoid infinite loops in cycles.',
        'Time complexity is O(V + E); finds shortest path in unweighted graphs.'
      ],
      commonPitfalls: [
        'Using list `pop(0)` instead of `deque.popleft()` degrades complexity to O(V²).',
        'Marking a vertex as visited only when dequeuing instead of when enqueuing causes duplicate queue entries.'
      ],
      examTips: [
        'In exams, remember: BFS = Queue = Shortest Path; DFS = Stack = Maze/Cycle detection.'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '13–15'
    }
  },
  {
    id: 'dsa-exp-9',
    subjectId: 'dsa',
    expNumber: 9,
    title: 'Infix to Prefix Conversion (Using Stack)',
    topic: 'Stack Applications',
    chapter: 'Experiment 9',
    aim: 'To convert an infix expression into its prefix (Polish) form using a stack.',
    problemStatement: 'Develop a program in Python to accept a standard infix mathematical expression (e.g. A+B*C) and convert it to prefix notation (+A*BC) handling operator precedence (^ > * / % > + -) and parenthetical grouping.',
    prerequisites: [
      {
        concept: 'Expression Notations',
        explanation: '1. Infix: Operator is between operands (e.g., A + B). Familiar to humans but requires parentheses for order.\n2. Prefix (Polish): Operator precedes operands (e.g., + A B). Evaluated without parentheses.\n3. Postfix (Reverse Polish): Operator follows operands (e.g., A B +).',
        example: 'Infix: (A + B) * C  ===> Prefix: * + A B C'
      },
      {
        concept: 'Algorithm Insight for Prefix',
        explanation: 'Prefix conversion can be performed elegantly using the Infix-to-Postfix (Shunting Yard) algorithm by:\n1. Reversing the infix expression\n2. Swapping ( with ) and vice-versa\n3. Running modified stack precedence parsing\n4. Reversing the final result string!',
        example: 'A+B*C reversed is C*B+A. Postfix of that is C B * A +. Reversing gives + A * B C.'
      }
    ],
    algorithm: [
      'Reverse the infix string: expression = expression[::-1].',
      'Swap parentheses: change "(" to ")" and ")" to "(".',
      'Initialize an empty stack = [] and result = "".',
      'Scan expression from left to right for each char:\n- If char is alphanumeric, append to result.\n- If char is "(", push to stack.\n- If char is ")", pop from stack to result until "(" is found; discard "(". \n- If char is operator: pop operators with higher precedence from stack to result, then push char to stack.',
      'Pop any remaining operators from stack to result.',
      'Reverse the result string: return result[::-1].'
    ],
    codeSnippets: [
      {
        language: 'python',
        filename: 'infix_to_prefix.py',
        explanation: 'Source implementation from DSA Experiments Code Reference PDF (Pages 15–16). Handles operator precedence and parentheses.',
        code: `def precedence(op):
    if op == '^':
        return 3
    elif op in '*/%':
        return 2
    elif op in '+-':
        return 1
    return 0

def infix_to_prefix(expression):
    expression = expression[::-1]
    expression = ''.join(')' if c == '(' else '(' if c == ')' else c
                         for c in expression)
    stack = []
    result = ""
    for char in expression:
        if char.isalnum():
            result += char
        elif char == '(':
            stack.append(char)
        elif char == ')':
            while stack and stack[-1] != '(':
                result += stack.pop()
            if stack:
                stack.pop()
        else:
            while (stack and stack[-1] != '(' and
                   precedence(stack[-1]) > precedence(char)):
                result += stack.pop()
            stack.append(char)
    while stack:
        result += stack.pop()
    return result[::-1]

expression = input("Enter infix expression: ")
print("Prefix expression:", infix_to_prefix(expression))`
      }
    ],
    lineByLineExplanation: [
      {
        lineRange: 'Lines 1–8',
        codeSnippet: `def precedence(op):\n    if op == '^':\n        return 3\n    elif op in '*/%':\n        return 2\n    elif op in '+-':\n        return 1\n    return 0`,
        whatItDoes: 'Assigns numerical priority: Exponentiation (3) > Multiplication/Division (2) > Addition/Subtraction (1).',
        whyNeeded: 'Governs operator binding order.',
        contribution: 'Defines operator hierarchy.'
      },
      {
        lineRange: 'Lines 11–13',
        codeSnippet: `expression = expression[::-1]\nexpression = ''.join(')' if c == '(' else '(' if c == ')' else c for c in expression)`,
        whatItDoes: 'Reverses the string and interchanges open and close parentheses.',
        whyNeeded: 'Transforms prefix problem into a reversed postfix problem.',
        contribution: 'Permits left-to-right stack parsing.'
      },
      {
        lineRange: 'Lines 24–27',
        codeSnippet: `while (stack and stack[-1] != '(' and precedence(stack[-1]) > precedence(char)):\n    result += stack.pop()\nstack.append(char)`,
        whatItDoes: 'Pops higher-precedence operators before pushing the current operator.',
        whyNeeded: 'Ensures higher precedence operations are calculated first.',
        contribution: 'Preserves mathematical precedence.'
      },
      {
        lineRange: 'Line 31',
        codeSnippet: `return result[::-1]`,
        whatItDoes: 'Reverses the accumulated result to produce the final valid prefix expression.',
        whyNeeded: 'Reverses the initial transformation.',
        contribution: 'Outputs final Polish notation.'
      }
    ],
    dryRun: {
      title: 'Infix to Prefix Trace for "A+B*C"',
      description: 'Step-by-step conversion of expression A+B*C.',
      initialInput: 'Infix: A+B*C',
      steps: [
        {
          stepNumber: 1,
          action: 'Reverse & swap parens',
          stateOrVariables: 'expression = "C*B+A"',
          outputOrLog: 'Ready for scan'
        },
        {
          stepNumber: 2,
          action: 'Scan "C"',
          stateOrVariables: 'Operand -> result = "C", stack = []',
          outputOrLog: 'result: "C"'
        },
        {
          stepNumber: 3,
          action: 'Scan "*"',
          stateOrVariables: 'Operator -> push * to stack. stack = ["*"]',
          outputOrLog: 'stack: ["*"]'
        },
        {
          stepNumber: 4,
          action: 'Scan "B"',
          stateOrVariables: 'Operand -> result = "CB", stack = ["*"]',
          outputOrLog: 'result: "CB"'
        },
        {
          stepNumber: 5,
          action: 'Scan "+"',
          stateOrVariables: 'prec(*) = 2 > prec(+) = 1 -> pop * to result. Push +. stack = ["+"], result = "CB*"',
          outputOrLog: 'result: "CB*"'
        },
        {
          stepNumber: 6,
          action: 'Scan "A"',
          stateOrVariables: 'Operand -> result = "CB*A", stack = ["+"]',
          outputOrLog: 'result: "CB*A"'
        },
        {
          stepNumber: 7,
          action: 'Flush stack & Reverse',
          stateOrVariables: 'Pop + -> result = "CB*A+". Reverse result -> "+A*BC"',
          outputOrLog: 'Final: "+A*BC"'
        }
      ],
      finalOutput: 'Prefix expression: +A*BC'
    },
    sampleInput: `Enter infix expression: (A+B)*C`,
    sampleOutput: `Prefix expression: *+ABC`,
    timeComplexity: 'Time Complexity: O(n) | Space Complexity: O(n)',
    spaceComplexity: 'O(n) auxiliary memory for the operator stack and reversed string buffers',
    complexityExplanation: 'The expression of length n is scanned twice (reversals and left-to-right pass). Each character is pushed and popped from the stack at most once, running in strictly linear O(n) time.',
    result: 'The infix mathematical expression was successfully converted to prefix form.',
    conclusion: 'Prefix and postfix expressions eliminate the need for parentheses and operator precedence rules during machine evaluation.',
    vivaQuestions: [
      {
        id: 'dsa-v-9-1',
        questionNumber: 1,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-9',
        question: 'Why are Prefix and Postfix expressions preferred over Infix expressions by compilers?',
        answer: 'Because compilers can evaluate prefix and postfix expressions in a single sequential pass using a stack without needing parentheses or looking ahead to check operator precedence.',
        category: 'viva'
      },
      {
        id: 'dsa-v-9-2',
        questionNumber: 2,
        subjectId: 'dsa',
        experimentId: 'dsa-exp-9',
        question: 'Why do we reverse the string when converting Infix to Prefix?',
        answer: 'Reversing the infix string and interchanging parentheses allows us to reuse the standard left-to-right Shunting Yard algorithm. Reversing the resulting postfix string at the end naturally produces the prefix expression.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Prefix: Operator comes before operands (+ A B).',
        'Algorithm: Reverse -> Swap parens -> Parse with Stack -> Reverse result.',
        'Precedence: ^ (3) > * / % (2) > + - (1).',
        'Time and space complexity are O(n).'
      ],
      commonPitfalls: [
        'Forgetting to swap "(" and ")" after reversing the string.',
        'Forgetting the final reverse of the output string.'
      ],
      examTips: [
        'Practice manual prefix conversion: `(A+B)*(C-D)` becomes `*+AB-CD`.'
      ]
    },
    sourceReference: {
      docName: 'DSA Experiments – Code Reference.pdf',
      pageNumber: '15–16'
    }
  }
];

export const DSA_QUESTION_BANK: QuestionItem[] = [
  {
    id: 'dsa-qb-1',
    subjectId: 'dsa',
    question: 'What is the difference between Linear and Non-Linear Data Structures?',
    answer: 'In linear data structures (Arrays, Linked Lists, Stacks, Queues), elements are arranged sequentially and each element has a unique predecessor and successor (except first and last). In non-linear data structures (Trees, Graphs), elements are arranged hierarchically or interconnectedly, where an element can connect to multiple elements.',
    category: 'theory',
    sourceDoc: 'DSA Experiments – Code Reference.pdf',
    pageNumber: 1
  },
  {
    id: 'dsa-qb-2',
    subjectId: 'dsa',
    question: 'Explain why pop(0) in Python list is O(n) while append() is O(1) amortized.',
    answer: 'Python lists are implemented as dynamically sized contiguous arrays of pointers. Appending adds an item at the current tail in O(1) time. Calling pop(0) removes the head pointer, requiring every remaining pointer from index 1 to n-1 to be shifted left in memory by one slot, which takes O(n) time.',
    category: 'theory',
    sourceDoc: 'DSA Experiments – Code Reference.pdf',
    pageNumber: 4
  },
  {
    id: 'dsa-qb-3',
    subjectId: 'dsa',
    question: 'How does Binary Search Tree differ from a Binary Tree?',
    answer: 'A Binary Tree simply has at most two children per node without ordering restrictions. A Binary Search Tree enforces the ordering property: for every node X, all values in its left subtree are strictly smaller than X, and all values in its right subtree are strictly greater than X.',
    category: 'theory',
    sourceDoc: 'DSA Experiments – Code Reference.pdf',
    pageNumber: 12
  },
  {
    id: 'dsa-qb-4',
    subjectId: 'dsa',
    question: 'What is the difference between BFS (Breadth First Search) and DFS (Depth First Search)?',
    answer: 'BFS explores a graph level-by-level using a FIFO Queue and finds the shortest path in unweighted graphs. DFS explores as deeply as possible along each branch before backtracking using a LIFO Stack or recursion, and is commonly used for topological sorting and cycle detection.',
    category: 'theory',
    sourceDoc: 'DSA Experiments – Code Reference.pdf',
    pageNumber: 13
  }
];
