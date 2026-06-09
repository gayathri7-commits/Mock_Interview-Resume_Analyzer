import axios from 'axios';
import { MOCK_ATS_PROFILES, MOCK_INTERVIEW_QUESTIONS, DEFAULT_QUESTIONS, MOCK_HISTORY } from './mockData';

// Toggle this to false to connect to your real Spring Boot backend
export const USE_MOCK = true;

// Base API URL for your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Simulates a delay for mock operations
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const resumeApi = {
  /**
   * Uploads resume file and target job role
   * @param {File} file - PDF/Docx file object
   * @param {string} jobRole - Selected job role
   */
  uploadResume: async (file, jobRole) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Uploading resume for role: ${jobRole}`);
      await delay(2000); // Simulate network latency and processing
      
      const profile = MOCK_ATS_PROFILES[jobRole] || {
        atsScore: 65,
        skillMatch: 70,
        matchedSkills: ["General Communication", "Basic Tech Skills"],
        keywordGaps: ["Advanced Frameworks", "System Design"],
        recommendations: ["Customize resume bullets", "Add more quantifiable metrics."]
      };
      
      return {
        success: true,
        data: {
          fileName: file.name,
          jobRole: jobRole,
          ...profile
        }
      };
    } else {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobRole', jobRole);
      
      const response = await apiClient.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }
  },

  /**
   * Fetches interview questions based on job role
   * @param {string} jobRole - Selected job role
   */
  getInterviewQuestions: async (jobRole) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Fetching questions for role: ${jobRole}`);
      await delay(1000);
      
      const questions = MOCK_INTERVIEW_QUESTIONS[jobRole] || DEFAULT_QUESTIONS;
      return {
        success: true,
        data: questions
      };
    } else {
      const response = await apiClient.get('/interview/questions', {
        params: { role: jobRole }
      });
      return response.data;
    }
  },

  /**
   * Submits user interview answers for evaluation
   * @param {object} sessionData - { jobRole, answers: [{ questionId, answer, language, timeTaken }] }
   */
  submitInterviewAnswers: async (sessionData) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Submitting interview answers:`, sessionData);
      await delay(2500); // Simulate AI analysis time
      
      // Calculate a semi-random dynamic score based on answer lengths
      let totalLength = 0;
      sessionData.answers.forEach(a => {
        totalLength += (a.answer || '').length;
      });
      
      const scoreModifier = Math.min(15, Math.floor(totalLength / 50));
      const finalScore = Math.min(96, Math.max(65, 75 + scoreModifier - Math.floor(Math.random() * 8)));
      
      const codingScore = Math.min(98, Math.max(70, finalScore + (Math.random() > 0.5 ? 5 : -5)));
      const hrScore = Math.min(95, Math.max(60, finalScore + (Math.random() > 0.5 ? -3 : 6)));
      
      return {
        success: true,
        data: {
          sessionId: `sess-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          overallScore: finalScore,
          breakdown: {
            coding: codingScore,
            hr: hrScore,
            communication: Math.min(94, Math.max(70, finalScore + 2)),
            technicalAccuracy: Math.min(97, Math.max(65, codingScore - 1))
          },
          evaluation: [
            "Demonstrated strong structured thinking in answering both HR and coding questions.",
            "Code solution was logical, but could be further optimized for space complexity.",
            "Communication during the HR questions was clear and concise, with good situational alignment."
          ],
          feedbackDetails: {
            codingFeedback: "The logic is clean. Ensure edge cases (like empty lists or null inputs) are handled properly in production.",
            hrFeedback: "Good structured answers. Try using the STAR method (Situation, Task, Action, Result) more explicitly to highlight your individual contributions."
          }
        }
      };
    } else {
      const response = await apiClient.post('/interview/submit', sessionData);
      return response.data;
    }
  },

  /**
   * Fetches historical performance analytics
   */
  getHistoricalAnalytics: async () => {
    if (USE_MOCK) {
      console.log('[MOCK API] Fetching performance history');
      await delay(800);
      return {
        success: true,
        data: MOCK_HISTORY
      };
    } else {
      const response = await apiClient.get('/analytics/history');
      return response.data;
    }
  }
};
