import React, { useState } from 'react';
import { Upload, FileText, Briefcase, TrendingUp, CheckCircle, XCircle, Moon, Sun, X, Search, DollarSign, Clock } from 'lucide-react';

const ResumeSkillMatcher = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState('matcher');
  const [recommendations, setRecommendations] = useState(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const jobDatabase = [
    { id: 1, title: "Full Stack Developer", company: "Tech Innovations Inc.", salary: "$100k - $140k", type: "Full-time", skills: ["javascript", "react", "node.js", "mongodb", "rest api", "git", "html", "css"] },
    { id: 2, title: "Machine Learning Engineer", company: "AI Solutions Corp", salary: "$120k - $160k", type: "Full-time", skills: ["python", "machine learning", "tensorflow", "pytorch", "data analysis", "deep learning", "nlp"] },
    { id: 3, title: "Frontend Developer", company: "Digital Design Studio", salary: "$80k - $110k", type: "Remote", skills: ["react", "javascript", "html", "css", "typescript", "ui/ux", "figma"] },
    { id: 4, title: "DevOps Engineer", company: "Cloud Systems Ltd", salary: "$110k - $150k", type: "Full-time", skills: ["aws", "docker", "kubernetes", "jenkins", "ci/cd", "git", "python"] },
    { id: 5, title: "Data Scientist", company: "Analytics Pro", salary: "$100k - $145k", type: "Full-time", skills: ["python", "machine learning", "data analysis", "sql", "pandas", "numpy", "scikit-learn"] },
    { id: 6, title: "Mobile App Developer", company: "Mobile First Inc", salary: "$90k - $130k", type: "Full-time", skills: ["react", "javascript", "swift", "kotlin", "rest api", "git"] },
    { id: 7, title: "Backend Developer", company: "Server Solutions", salary: "$95k - $135k", type: "Remote", skills: ["python", "django", "postgresql", "rest api", "docker", "redis", "git"] },
    { id: 8, title: "Cloud Architect", company: "Enterprise Cloud", salary: "$130k - $180k", type: "Full-time", skills: ["aws", "azure", "kubernetes", "microservices", "docker", "ci/cd", "python"] },
    { id: 9, title: "UI/UX Designer", company: "Creative Designs Co", salary: "$75k - $105k", type: "Full-time", skills: ["ui/ux", "figma", "sketch", "adobe xd", "html", "css"] },
    { id: 10, title: "QA Engineer", company: "Quality First", salary: "$70k - $100k", type: "Full-time", skills: ["testing", "debugging", "python", "javascript", "git", "agile"] },
    { id: 11, title: "Software Engineer", company: "Tech Giants", salary: "$110k - $160k", type: "Full-time", skills: ["java", "python", "data structures", "algorithms", "sql", "git", "oop"] },
    { id: 12, title: "Project Manager", company: "Agile Works", salary: "$85k - $120k", type: "Remote", skills: ["project management", "agile", "scrum", "jira", "communication", "leadership"] }
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadError('');
    setResumeFileName(file.name);
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        const text = await file.text();
        setResumeText(text);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value);
      } else {
        setUploadError('Unsupported file format. Please upload .txt or .docx files.');
        setResumeFileName('');
      }
    } catch (error) {
      setUploadError('Error reading file. Please try copying and pasting the text instead.');
      setResumeFileName('');
    }
    event.target.value = '';
  };

  const extractSkills = (text) => {
    const commonSkills = ['python', 'java', 'javascript', 'react', 'node.js', 'sql', 'mongodb', 'machine learning', 'data analysis', 'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'html', 'css', 'angular', 'vue.js', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'typescript', 'rest api', 'graphql', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'jenkins', 'ci/cd', 'microservices', 'cloud computing', 'azure', 'gcp', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch', 'communication', 'leadership', 'problem solving', 'teamwork', 'project management', 'data structures', 'algorithms', 'oop', 'testing', 'debugging', 'ui/ux', 'figma', 'sketch', 'adobe xd', 'express', 'django', 'flask', 'spring boot', 'laravel', 'pandas', 'numpy', 'scikit-learn', 'keras', 'excel', 'powerpoint', 'jira', 'confluence', 'slack', 'trello', 'notion'];
    const lowerText = text.toLowerCase();
    const foundSkills = [];
    commonSkills.forEach(skill => {
      if (lowerText.includes(skill)) foundSkills.push(skill);
    });
    return foundSkills;
  };

  const calculateSimilarity = (set1, set2) => {
    if (set1.length === 0 || set2.length === 0) return 0;
    const intersection = set1.filter(skill => set2.includes(skill));
    const union = [...new Set([...set1, ...set2])];
    return (intersection.length / union.length) * 100;
  };

  const analyzeMatch = () => {
    setLoading(true);
    setTimeout(() => {
      const resumeSkills = extractSkills(resumeText);
      const jobSkills = extractSkills(jobDescription);
      const matchedSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
      const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
      const matchScore = calculateSimilarity(resumeSkills, jobSkills);
      setResults({
        matchScore: Math.round(matchScore),
        matchedSkills,
        missingSkills,
        totalResumeSkills: resumeSkills.length,
        totalJobSkills: jobSkills.length
      });
      setLoading(false);
    }, 1500);
  };

  const getJobRecommendations = () => {
    if (!resumeText) return;
    setRecommendationsLoading(true);
    setTimeout(() => {
      const resumeSkills = extractSkills(resumeText);
      const jobMatches = jobDatabase.map(job => {
        const matchedSkills = resumeSkills.filter(skill => job.skills.includes(skill));
        const matchScore = calculateSimilarity(resumeSkills, job.skills);
        return { ...job, matchScore: Math.round(matchScore), matchedSkills: matchedSkills.length, totalSkills: job.skills.length };
      });
      const sortedJobs = jobMatches.sort((a, b) => b.matchScore - a.matchScore).filter(job => job.matchScore > 0);
      setRecommendations({ jobs: sortedJobs, totalMatches: sortedJobs.length });
      setRecommendationsLoading(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 40) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (darkMode) {
      if (score >= 70) return 'bg-green-900/30';
      if (score >= 40) return 'bg-yellow-900/30';
      return 'bg-red-900/30';
    }
    if (score >= 70) return 'bg-green-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getJobScoreBadge = (score) => {
    if (score >= 70) return darkMode ? 'bg-green-900/50 text-green-300 border-green-500' : 'bg-green-100 text-green-800 border-green-300';
    if (score >= 40) return darkMode ? 'bg-yellow-900/50 text-yellow-300 border-yellow-500' : 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return darkMode ? 'bg-blue-900/50 text-blue-300 border-blue-500' : 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4 relative">
            <Briefcase className={`w-12 h-12 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Resume Skill Matcher</h1>
            <button onClick={() => setDarkMode(!darkMode)} className={`absolute right-0 p-3 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-white hover:bg-gray-100 text-gray-800'} shadow-lg hover:shadow-xl transform hover:scale-110`}>
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Analyze your resume and get personalized job recommendations</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className={`inline-flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <button onClick={() => setActiveTab('matcher')} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'matcher' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
              <TrendingUp className="w-5 h-5 inline-block mr-2" />Skill Matcher
            </button>
            <button onClick={() => { setActiveTab('recommendations'); if (resumeText && !recommendations) getJobRecommendations(); }} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'recommendations' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
              <Search className="w-5 h-5 inline-block mr-2" />Job Recommendations
            </button>
          </div>
        </div>

        {activeTab === 'matcher' && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className={`rounded-xl shadow-lg p-6 transform transition hover:scale-105 duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className={`w-6 h-6 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Your Resume</h2>
                  </div>
                  {resumeText && <button onClick={() => { setResumeText(''); setResumeFileName(''); setUploadError(''); }} className={`p-1 rounded-full transition ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}><X className="w-5 h-5" /></button>}
                </div>
                <div className="mb-4">
                  <label className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${darkMode ? 'border-gray-600 hover:border-indigo-500 bg-gray-700/50 hover:bg-gray-700' : 'border-gray-300 hover:border-indigo-500 bg-gray-50 hover:bg-gray-100'}`}>
                    <Upload className={`w-5 h-5 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{resumeFileName || 'Upload Resume (.txt, .docx)'}</span>
                    <input type="file" className="hidden" accept=".txt,.docx,.doc" onChange={handleFileUpload} />
                  </label>
                  {resumeFileName && <p className={`text-sm mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>✓ Loaded: {resumeFileName}</p>}
                  {uploadError && <p className={`text-sm mt-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>⚠ {uploadError}</p>}
                </div>
                <textarea className={`w-full h-56 p-4 border-2 rounded-lg focus:outline-none resize-none transition ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-indigo-500 text-white placeholder-gray-400' : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900 placeholder-gray-400'}`} placeholder="Or paste your resume text here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
              </div>
              <div className={`rounded-xl shadow-lg p-6 transform transition hover:scale-105 duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center mb-4">
                  <Briefcase className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Job Description</h2>
                </div>
                <textarea className={`w-full h-72 p-4 border-2 rounded-lg focus:outline-none resize-none transition ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-purple-500 text-white placeholder-gray-400' : 'bg-white border-gray-200 focus:border-purple-500 text-gray-900 placeholder-gray-400'}`} placeholder="Paste the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
              </div>
            </div>

            <div className="text-center mb-8">
              <button onClick={analyzeMatch} disabled={!resumeText || !jobDescription || loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Analyzing...</span> : <span className="flex items-center justify-center"><TrendingUp className="w-5 h-5 mr-2" />Analyze Match</span>}
              </button>
            </div>

            {results && (
              <div className="space-y-6">
                <div className={`${getScoreBackground(results.matchScore)} rounded-xl shadow-lg p-8 text-center transform transition hover:scale-105 duration-300`}>
                  <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Match Score</h2>
                  <div className={`text-6xl font-bold ${getScoreColor(results.matchScore)} mb-2`}>{results.matchScore}%</div>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {results.matchScore >= 70 && "Excellent match! Your resume aligns well with the job."}
                    {results.matchScore >= 40 && results.matchScore < 70 && "Good match! Consider adding missing skills."}
                    {results.matchScore < 40 && "Needs improvement. Focus on acquiring missing skills."}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className={`rounded-xl shadow-lg p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{results.matchedSkills.length}</div>
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Matched Skills</div>
                  </div>
                  <div className={`rounded-xl shadow-lg p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{results.missingSkills.length}</div>
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Missing Skills</div>
                  </div>
                  <div className={`rounded-xl shadow-lg p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{results.totalResumeSkills}</div>
                    <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Resume Skills</div>
                  </div>
                </div>

                {results.matchedSkills.length > 0 && (
                  <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                      <CheckCircle className={`w-6 h-6 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Matched Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {results.matchedSkills.map((skill, index) => (
                        <span key={index} className={`px-4 py-2 rounded-full font-medium transform transition hover:scale-110 duration-200 ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {results.missingSkills.length > 0 && (
                  <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                      <XCircle className={`w-6 h-6 mr-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Missing Skills</h3>
                    </div>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Consider learning these skills:</p>
                    <div className="flex flex-wrap gap-3">
                      {results.missingSkills.map((skill, index) => (
                        <span key={index} className={`px-4 py-2 rounded-full font-medium transform transition hover:scale-110 duration-200 ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'recommendations' && (
          <div>
            {!resumeText ? (
              <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Search className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upload Your Resume First</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Go to the Skill Matcher tab and upload your resume.</p>
                <button onClick={() => setActiveTab('matcher')} className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300">Go to Skill Matcher</button>
              </div>
            ) : recommendationsLoading ? (
              <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <svg className="animate-spin h-16 w-16 mx-auto mb-4 text-indigo-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Finding the best jobs for you...</h3>
              </div>
            ) : recommendations ? (
              <div className="space-y-6">
                <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recommended Jobs for You</h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Found {recommendations.totalMatches} matching jobs</p>
                </div>

                {recommendations.jobs.length > 0 ? (
                  <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <tr>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Job Title</th>
                            <th className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Salary Range</th>
                            <th className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Work Type</th>
                            <th className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Eligibility</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                          {recommendations.jobs.map((job) => (
                            <tr key={job.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                              <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <div className="font-semibold text-lg">{job.title}</div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{job.company}</div>
                              </td>
                              <td className={`px-6 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <div className="flex items-center justify-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="font-medium">{job.salary}</span>
                                </div>
                              </td>
                              <td className={`px-6 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <div className="flex items-center justify-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>{job.type}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold border-2 ${getJobScoreBadge(job.matchScore)}`}>{job.matchScore}%</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <XCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>No Matching Jobs Found</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try adding more skills to your resume.</p>
                  </div>
                )}

                {recommendations.jobs.length > 0 && (
                  <div className="text-center">
                    <button onClick={getJobRecommendations} className={`px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-800'}`}>Refresh Recommendations</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <button onClick={getJobRecommendations} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300">
                  <Search className="w-6 h-6 inline-block mr-2" />Get Job Recommendations
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSkillMatcher;
