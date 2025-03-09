
import React from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const resumeIdeas = [
  "Technical Skills: Highlight programming languages, tools, and technologies you're proficient in",
  "Project Showcases: Detail your most impressive projects with measurable results",
  "Problem-Solving Abilities: Describe challenges you've overcome with technical solutions",
  "Continuous Learning: Show how you stay updated with latest technologies",
  "Collaborative Work: Emphasize teamwork and communication skills",
  "Code Quality: Mention your focus on clean, maintainable code",
  "Version Control: Highlight experience with Git or other VCS tools",
  "Testing Experience: Detail your approach to unit, integration, and system testing",
  "Agile Methodology: Show your familiarity with Scrum, Kanban, or other methodologies",
  "API Development: Highlight experience creating and consuming APIs",
  "Database Knowledge: List experience with SQL, NoSQL databases",
  "Cloud Services: Detail experience with AWS, Azure, GCP, etc.",
  "Security Awareness: Show understanding of security principles",
  "Performance Optimization: Describe how you improved application performance",
  "Mobile Development: Showcase any mobile app development experience",
  "Responsive Design: Highlight responsive web development skills",
  "Accessibility Focus: Show commitment to creating accessible applications",
  "DevOps Experience: Detail CI/CD pipeline knowledge",
  "Open Source Contributions: Highlight contributions to open source projects",
  "Technical Writing: Showcase documentation or blog writing skills",
  "Code Review: Emphasize experience with code review processes",
  "Mentorship: Describe mentoring junior developers",
  "System Architecture: Show ability to design scalable systems",
  "Debugging Skills: Highlight problem diagnosis and resolution",
  "Technical Leadership: Detail team lead experience",
  "Algorithm Knowledge: Emphasize efficient algorithm implementation",
  "Data Structures: Show understanding of appropriate data structure usage",
  "UI/UX Awareness: Highlight focus on user experience",
  "Microservices: Detail experience with microservice architecture",
  "Containerization: Show Docker or Kubernetes experience",
  "Serverless Architecture: Highlight serverless function experience",
  "Machine Learning: Detail any ML model implementation",
  "Big Data: Show experience handling large datasets",
  "Localization: Highlight international application development",
  "Cross-platform Development: Show ability to develop for multiple platforms",
  "RESTful Design: Emphasize understanding of REST principles",
  "GraphQL: Detail GraphQL implementation experience",
  "WebSockets: Highlight real-time application development",
  "Progressive Web Apps: Show PWA development experience",
  "Single Page Applications: Detail SPA framework experience",
  "Blockchain: Highlight any blockchain development",
  "IoT Development: Show Internet of Things experience",
  "Game Development: Detail game programming experience",
  "Automated Testing: Highlight test automation skills",
  "Refactoring Skills: Show ability to improve existing code",
  "Legacy Code Management: Detail experience updating legacy systems",
  "Technical Debt Reduction: Show how you reduced technical debt",
  "Deployment Strategies: Detail blue-green or canary deployment knowledge",
  "Monitoring & Logging: Highlight application monitoring experience",
  "Error Handling: Show comprehensive error management implementation",
  "Asynchronous Programming: Detail async/await or Promise experience",
  "Event-Driven Architecture: Show event-based system design",
  "Functional Programming: Highlight functional programming paradigm usage",
  "Object-Oriented Design: Detail OOP principles application",
  "Design Patterns: Show understanding of common design patterns",
  "Technical Presentations: Highlight experience presenting technical topics",
  "Code Optimization: Show performance optimization skills",
  "Memory Management: Detail efficient memory usage implementation",
  "Distributed Systems: Show experience with distributed architecture",
  "High Availability: Highlight designing for high availability",
  "Fault Tolerance: Detail building fault-tolerant systems",
  "Technical Decision Making: Show process for evaluating technical choices",
  "API Gateway Implementation: Highlight API management experience",
  "Authentication Systems: Detail secure auth implementation",
  "Authorization Framework: Show role-based access control experience",
  "Third-party Integration: Highlight experience connecting to external services",
  "Real-time Analytics: Detail implementing analytic dashboards",
  "Caching Strategies: Show implementing cache for performance",
  "Search Implementation: Highlight full-text search experience",
  "ETL Processes: Detail data extraction/transformation experience",
  "Internationalization: Show multilingual application development",
  "Responsive Email Templates: Highlight email system design",
  "Payment Processing: Detail secure payment implementation",
  "PDF Generation: Show dynamic document generation",
  "Image Processing: Highlight image manipulation skills",
  "Video Streaming: Detail video delivery implementation",
  "WebRTC: Show peer-to-peer communication implementation",
  "Progressive Enhancement: Highlight graceful degradation approach",
  "Static Site Generation: Show SSG experience",
  "Server-Side Rendering: Detail SSR implementation",
  "JAMstack: Highlight JAMstack architecture experience",
  "Content Management: Detail headless CMS integration",
  "A/B Testing: Show feature testing implementation",
  "Feature Flagging: Highlight feature toggle usage",
  "Dark Mode Implementation: Show UI theme switching",
  "Drag-and-Drop Interfaces: Detail interactive UI development",
  "Data Visualization: Highlight chart and graph implementation",
  "Maps Integration: Show geospatial feature development",
  "Voice User Interfaces: Detail voice command implementation",
  "Browser Extensions: Highlight browser plugin development",
  "Web Workers: Show multithreaded web application experience",
  "IndexedDB: Detail client-side storage implementation",
  "Service Workers: Highlight offline capability implementation",
  "Web Scraping: Show data extraction experience",
  "Regular Expressions: Detail complex pattern matching",
  "WebAssembly: Highlight WASM implementation",
  "Cross-browser Compatibility: Show cross-browser testing",
  "Web Standards Compliance: Detail adherence to W3C standards",
  "Web Components: Highlight custom element creation"
];

const ResumeIdeas: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <NavBar />
          
          <Card className="glass-panel animate-fade-in">
            <CardHeader>
              <CardTitle>100 Resume Ideas for Job Applications</CardTitle>
              <CardDescription>
                Enhance your resume with these professional points tailored for tech positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <ul className="space-y-2">
                  {resumeIdeas.map((idea, index) => (
                    <li key={index} className="p-3 rounded-md hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <span>{idea}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeIdeas;
