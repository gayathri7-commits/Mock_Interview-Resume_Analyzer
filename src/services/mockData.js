// Mock Data Service for Simulation Mode
export const JOB_ROLES = [
  "Software Engineer (Frontend)",
  "Full Stack Developer (React & Spring Boot)",
  "Backend Engineer (Java/Spring Boot)",
  "Data Scientist / AI Engineer",
  "Product Manager"
];

export const MOCK_ATS_PROFILES = {
  "Software Engineer (Frontend)": {
    atsScore: 78,
    skillMatch: 82,
    matchedSkills: ["ReactJS", "JavaScript (ES6+)", "CSS3 / TailwindCSS", "HTML5", "Git", "REST APIs", "TypeScript"],
    keywordGaps: ["Next.js", "Redux Toolkit", "Webpack", "Unit Testing (Jest)", "Web Accessibility (a11y)"],
    recommendations: [
      "Add Redux or Context API state management experience to your resume.",
      "Highlight modern SSR framework experience like Next.js.",
      "Incorporate unit testing frameworks (Jest, React Testing Library) to showcase production-readiness.",
      "Optimize your project descriptions by focusing on performance metrics (e.g., LCP, FID improvements)."
    ]
  },
  "Full Stack Developer (React & Spring Boot)": {
    atsScore: 84,
    skillMatch: 88,
    matchedSkills: ["ReactJS", "JavaScript", "Java", "Spring Boot", "MySQL", "REST APIs", "Git", "Spring Security"],
    keywordGaps: ["Docker", "Kubernetes", "AWS (S3/EC2)", "CI/CD (Jenkins)", "JUnit / Mockito Testing"],
    recommendations: [
      "Include cloud deployment and containerization keywords such as Docker or AWS.",
      "Add JUnit/Mockito testing experience to demonstrate reliable backend practices.",
      "Mention CI/CD integrations or automated deployment pipelines you have built.",
      "Include cache utilization (Redis) or message broker experience (Kafka) to stand out."
    ]
  },
  "Backend Engineer (Java/Spring Boot)": {
    atsScore: 72,
    skillMatch: 76,
    matchedSkills: ["Java 17+", "Spring Boot", "MySQL", "REST APIs", "Hibernate/JPA", "SQL", "Git"],
    keywordGaps: ["Microservices", "Docker", "Redis", "Kafka", "Spring Cloud", "PostgreSQL"],
    recommendations: [
      "Integrate architecture terms like 'Microservices' and 'Distributed Systems'.",
      "Highlight multi-threading, concurrency, and performance optimization achievements.",
      "Add message brokers like Apache Kafka or RabbitMQ to show experience with async messaging.",
      "Demonstrate cloud database integration or migrations (e.g. Flyway/Liquibase)."
    ]
  },
  "Data Scientist / AI Engineer": {
    atsScore: 81,
    skillMatch: 85,
    matchedSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Machine Learning", "Data Visualization", "Git"],
    keywordGaps: ["PyTorch / TensorFlow", "Docker", "MloPs (MLflow)", "AWS Sagemaker", "Big Data (Spark)"],
    recommendations: [
      "Highlight deep learning frameworks (TensorFlow, PyTorch) or Large Language Model adjustments.",
      "Describe model productionization processes and MLOps tooling (like MLflow or Docker).",
      "List database optimization skills or Big Data tools (Apache Spark, Hadoop).",
      "Connect models to actual business value (e.g., 'increased conversions by 12%')."
    ]
  },
  "Product Manager": {
    atsScore: 68,
    skillMatch: 70,
    matchedSkills: ["Product Strategy", "Roadmapping", "Agile/Scrum", "User Research", "Jira", "Cross-functional Leadership"],
    keywordGaps: ["SQL / Data Analytics", "A/B Testing", "KPI Tracking", "Product Analytics (Mixpanel)", "Tech Stack Literacy"],
    recommendations: [
      "Incorporate data-driven keywords like 'A/B Testing', 'KPI Metrics', and 'Product Analytics'.",
      "Quantify your accomplishments (e.g., 'grew monthly active users by 35%').",
      "Include tech-adjacent tools you work with, like Mixpanel, SQL, or Tableau.",
      "Explain your budget planning and resource allocation methodologies."
    ]
  }
};

export const MOCK_INTERVIEW_QUESTIONS = {
  "Software Engineer (Frontend)": {
    technical: [
      {
        id: "fe-tech-1",
        question: "Write a function in JavaScript that takes an array of integers and returns a new array containing only the duplicate values, sorted in ascending order.",
        starterCode: {
          javascript: `function findDuplicates(arr) {\n  // Write your code here\n  return [];\n}\n\n// Example: findDuplicates([4, 3, 2, 7, 8, 2, 3, 1]) -> [2, 3]`,
          typescript: `function findDuplicates(arr: number[]): number[] {\n  // Write your code here\n  return [];\n}`,
          python: `def find_duplicates(arr):\n    # Write your code here\n    return []`
        },
        timeLimit: 900 // 15 mins
      },
      {
        id: "fe-tech-2",
        question: "Implement a simple debounce function in JavaScript. It should accept a callback function and a delay in milliseconds, returning a debounced version of the function.",
        starterCode: {
          javascript: `function debounce(func, delay) {\n  // Write your code here\n  return function(...args) {\n    \n  };\n}`,
          typescript: `function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {\n  // Write your code here\n  return function(...args) {\n    \n  };\n}`,
          python: `import time\n# Debounce implementation in Python (for decorator syntax)\ndef debounce(delay):\n    # Write code here\n    pass`
        },
        timeLimit: 600 // 10 mins
      }
    ],
    hr: [
      {
        id: "fe-hr-1",
        question: "Tell me about a time you had to deal with a severe UI performance bottleneck in React. How did you diagnose the issue, and what optimizations did you implement?"
      },
      {
        id: "fe-hr-2",
        question: "How do you handle disagreements with UI/UX designers regarding the technical feasibility of a design choice?"
      }
    ]
  },
  "Full Stack Developer (React & Spring Boot)": {
    technical: [
      {
        id: "fs-tech-1",
        question: "Write a React hook `useFetch` in JavaScript that fetches data from a given URL, handles loading and error states, and returns `data`, `loading`, and `error` objects.",
        starterCode: {
          javascript: `import { useState, useEffect } from 'react';\n\nfunction useFetch(url) {\n  // Write your custom hook here\n  return { data: null, loading: true, error: null };\n}`,
          typescript: `import { useState, useEffect } from 'react';\n\ninterface FetchResult<T> {\n  data: T | null;\n  loading: boolean;\n  error: Error | null;\n}\n\nfunction useFetch<T>(url: string): FetchResult<T> {\n  // Write your custom hook here\n  return { data: null, loading: true, error: null };\n}`
        },
        timeLimit: 900
      },
      {
        id: "fs-tech-2",
        question: "Implement a Java class simulating a basic REST controller endpoint in Spring Boot that performs CRUD operations on a list of Task items (e.g. GET, POST, DELETE).",
        starterCode: {
          java: `import org.springframework.web.bind.annotation.*;\nimport java.util.*;\n\n@RestController\n@RequestMapping("/api/tasks")\npublic class TaskController {\n    private List<String> tasks = new ArrayList<>();\n\n    @GetMapping\n    public List<String> getAllTasks() {\n        return tasks;\n    }\n\n    @PostMapping\n    public String addTask(@RequestBody String task) {\n        // Complete the code\n        return "Added";\n    }\n}`
        },
        timeLimit: 900
      }
    ],
    hr: [
      {
        id: "fs-hr-1",
        question: "Describe your workflow when debugging an issue that spans both the React frontend and Spring Boot backend. How do you trace the root cause?"
      },
      {
        id: "fs-hr-2",
        question: "How do you manage security, authentication, and token handoffs (like JWTs) between your frontend Client and Spring Boot server?"
      }
    ]
  },
  "Backend Engineer (Java/Spring Boot)": {
    technical: [
      {
        id: "be-tech-1",
        question: "Write a Java method to check if a binary tree is a valid Binary Search Tree (BST). Complete the `isValidBST` function.",
        starterCode: {
          java: `class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode(int x) { val = x; }\n}\n\npublic class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Write logic here\n        return true;\n    }\n}`,
          python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def isValidBST(self, root: TreeNode) -> bool:\n        # Write logic here\n        return True`
        },
        timeLimit: 900
      },
      {
        id: "be-tech-2",
        question: "Implement a thread-safe Singleton pattern in Java, using double-checked locking.",
        starterCode: {
          java: `public class DatabaseConnectionManager {\n    private static volatile DatabaseConnectionManager instance;\n\n    private DatabaseConnectionManager() {}\n\n    public static DatabaseConnectionManager getInstance() {\n        // Write thread-safe double checked locking here\n        return instance;\n    }\n}`
        },
        timeLimit: 600
      }
    ],
    hr: [
      {
        id: "be-hr-1",
        question: "Tell me about a time you optimized a slow database query in Spring Boot. What tools did you use, and how did you restructure the query or schema?"
      },
      {
        id: "be-hr-2",
        question: "How do you design REST APIs to ensure they are scalable and resilient against heavy spikes in traffic?"
      }
    ]
  },
  "Data Scientist / AI Engineer": {
    technical: [
      {
        id: "ds-tech-1",
        question: "Write a Python function to compute the cosine similarity between two numeric vectors of equal length.",
        starterCode: {
          python: `import math\n\ndef cosine_similarity(v1, v2):\n    # Write your mathematical logic here\n    # Return a float value representing similarity\n    return 0.0\n\n# Example: cosine_similarity([1, 2, 3], [1, 2, 3]) -> 1.0`
        },
        timeLimit: 600
      }
    ],
    hr: [
      {
        id: "ds-hr-1",
        question: "How do you evaluate if a model is overfitting to training data? What regularizations or methodologies do you apply to fix it?"
      }
    ]
  },
  "Product Manager": {
    technical: [
      {
        id: "pm-tech-1",
        question: "A popular ride-sharing app is experiencing a 15% drop in ride completions in your region. Outline the step-by-step diagnostic framework you would use to identify the root cause.",
        starterCode: {
          text: `// Enter your structured PM diagnostic response here.\n// Include:\n// 1. Initial assumptions\n// 2. Metrics breakdown (User funnel)\n// 3. Potential hypotheses (Supply side, demand side, technical bugs)\n// 4. Verification method for each hypothesis`
        },
        timeLimit: 1200
      }
    ],
    hr: [
      {
        id: "pm-hr-1",
        question: "How do you prioritize features for a product roadmap when you have competing requests from engineering, sales, and senior management?"
      }
    ]
  }
};

// Fallback questions for any non-listed roles
export const DEFAULT_QUESTIONS = {
  technical: [
    {
      id: "def-tech-1",
      question: "Write a function in your language of choice to reverse a string in-place without allocating additional memory for another string.",
      starterCode: {
        javascript: `function reverseString(s) {\n  // Write your code here\n}`,
        python: `def reverse_string(s):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}`
      },
      timeLimit: 600
    }
  ],
  hr: [
    {
      id: "def-hr-1",
      question: "Tell me about a challenging professional project you completed recently. What hurdles did you face, and how did you overcome them?"
    }
  ]
};

// Historical analytics for Performance Dashboard
export const MOCK_HISTORY = [
  { id: "hist-1", date: "2026-05-15", role: "Software Engineer (Frontend)", score: 68, type: "HR & Tech Combined" },
  { id: "hist-2", date: "2026-05-22", role: "Software Engineer (Frontend)", score: 74, type: "Technical Only" },
  { id: "hist-3", date: "2026-06-01", role: "Full Stack Developer", score: 81, type: "HR Only" },
  { id: "hist-4", date: "2026-06-07", role: "Full Stack Developer", score: 85, type: "HR & Tech Combined" }
];
