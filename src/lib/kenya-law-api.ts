// Kenya Law API Integration
// This file contains utilities for integrating with Kenya Law database and GPT

export interface KenyaLawCase {
  id: string;
  title: string;
  citation: string;
  year: string;
  court: string;
  summary: string;
  fullText: string;
  keywords: string[];
  relevance: number;
  doc_type?: string;
  date?: string;
  jurisdiction?: string;
  judges?: string[];
  case_number?: string[];
  nature?: string;
  registry?: string;
}

export interface KenyaLawStatute {
  id: string;
  title: string;
  section: string;
  content: string;
  chapter: string;
  relevance: number;
}

export interface KenyaLawSearchResult {
  cases: KenyaLawCase[];
  statutes: KenyaLawStatute[];
  totalResults: number;
  searchQuery: string;
}

export interface KenyaLawAPIResponse {
  count: number;
  results: any[];
  facets?: any;
}

// Real Kenya Law API integration with CORS handling
// export class KenyaLawAPI {
//   private static baseUrl = '/api/kenya-law'; // Use local proxy

//   static async searchCases(query: string, limit: number = 10): Promise<KenyaLawCase[]> {
//     try {
//       console.log(`Searching Kenya Law for: ${query}`);
      
//       const params = new URLSearchParams({
//         search: query,
//         page: '1',
//         ordering: '-score',
//         suggestion: ''
//       });

//       // Add facet parameters
//       const facets = [
//         'nature', 'court', 'year', 'registry', 'locality', 
//         'outcome', 'judges', 'authors', 'language', 'labels', 
//         'attorneys', 'matter_type'
//       ];
      
//       facets.forEach(facet => {
//         params.append('facet', facet);
//       });

//       const fullUrl = `${this.baseUrl}?${params.toString()}`;
      
//       console.log(`Making request to: ${fullUrl}`);
      
//       const response = await fetch(fullUrl, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(15000) // 15 second timeout
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: KenyaLawAPIResponse = await response.json();
      
//       console.log(`Received ${data.results?.length || 0} results from Kenya Law API`);
      
//       // Transform the API response to our interface
//       return data.results.map((result, index) => ({
//         id: result.id || index.toString(),
//         title: result.title || 'Untitled Case',
//         citation: result.citation || result.title || 'No Citation',
//         year: result.year?.toString() || 'Unknown',
//         court: result.court || 'Unknown Court',
//         summary: this.generateSummary(result),
//         fullText: 'Full case text would be loaded from Kenya Law database...',
//         keywords: this.extractKeywords(result),
//         relevance: this.calculateRelevance(result),
//         doc_type: result.doc_type,
//         date: result.date,
//         jurisdiction: result.jurisdiction,
//         judges: result.judges,
//         case_number: result.case_number,
//         nature: result.nature,
//         registry: result.registry
//       }));
//     } catch (error) {
//       console.error('Error searching Kenya Law:', error);
      
//       // Return mock data as fallback with better error handling
//       return this.getMockCases(query);
//     }
//   }

//   private static getMockCases(query: string): KenyaLawCase[] {
//     // Generate more realistic mock data based on the query
//     const queryLower = query.toLowerCase();
    
//     if (queryLower.includes('murder')) {
//       return [
//         {
//           id: '1',
//           title: 'Republic v John Doe',
//           citation: 'Criminal Case No. 123 of 2023',
//           year: '2023',
//           court: 'High Court of Kenya',
//           summary: 'Landmark case on the interpretation of Section 203 of the Penal Code regarding murder charges.',
//           fullText: 'Full case text would be loaded from Kenya Law database...',
//           keywords: ['murder', 'penal code', 'section 203'],
//           relevance: 0.95
//         },
//         {
//           id: '2',
//           title: 'Jane Smith v State',
//           citation: 'Criminal Appeal No. 456 of 2022',
//           year: '2022',
//           court: 'Court of Appeal',
//           summary: 'Important precedent on sentencing guidelines for murder cases.',
//           fullText: 'Full case text would be loaded from Kenya Law database...',
//           keywords: ['murder', 'sentencing', 'appeal'],
//           relevance: 0.88
//         }
//       ];
//     } else if (queryLower.includes('robbery')) {
//       return [
//         {
//           id: '3',
//           title: 'Republic v Robbery Suspect',
//           citation: 'Criminal Case No. 789 of 2023',
//           year: '2023',
//           court: 'High Court of Kenya',
//           summary: 'Case involving robbery with violence under Section 296 of the Penal Code.',
//           fullText: 'Full case text would be loaded from Kenya Law database...',
//           keywords: ['robbery', 'violence', 'penal code'],
//           relevance: 0.92
//         }
//       ];
//     } else if (queryLower.includes('divorce')) {
//       return [
//         {
//           id: '4',
//           title: 'Jane Doe v John Doe',
//           citation: 'Divorce Cause No. 456 of 2023',
//           year: '2023',
//           court: 'High Court of Kenya',
//           summary: 'Divorce proceedings under the Marriage Act and related family law provisions.',
//           fullText: 'Full case text would be loaded from Kenya Law database...',
//           keywords: ['divorce', 'marriage', 'family law'],
//           relevance: 0.90
//         }
//       ];
//     } else {
//       // Generic mock data
//       return [
//         {
//           id: '1',
//           title: 'Republic v John Doe',
//           citation: 'Criminal Case No. 123 of 2023',
//           year: '2023',
//           court: 'High Court of Kenya',
//           summary: `Landmark case on the interpretation of ${query} under Kenyan law.`,
//           fullText: 'Full case text would be loaded from Kenya Law database...',
//           keywords: [query.toLowerCase(), 'kenyan law', 'legal precedent'],
//           relevance: 0.85
//         },
//         {
//           id: '2',
//           title: 'Jane Smith v State',
//           citation: 'Criminal Appeal No. 456 of 2022',
//           year: '2022',
//           court: 'Court of Appeal',
//           summary: `Important precedent on ${query} cases and procedural matters.`,
//           fullText: 'Full case text would be loaded from Kenya Law database...',
//           keywords: [query.toLowerCase(), 'appeal', 'procedure'],
//           relevance: 0.78
//         }
//       ];
//     }
//   }

//   private static generateSummary(result: any): string {
//     if (result.highlight?.content) {
//       return result.highlight.content.join(' ').substring(0, 200) + '...';
//     }
//     return `Case involving ${result.title || 'legal matter'} decided in ${result.year || 'unknown year'}.`;
//   }

//   private static extractKeywords(result: any): string[] {
//     const keywords = [];
//     if (result.title) keywords.push(...result.title.toLowerCase().split(' ').slice(0, 5));
//     if (result.court) keywords.push(result.court.toLowerCase());
//     if (result.nature) keywords.push(result.nature.toLowerCase());
//     return [...new Set(keywords)].filter(k => k.length > 2);
//   }

//   private static calculateRelevance(result: any): number {
//     // Use the API's score if available, otherwise calculate based on year
//     if (result._score) {
//       return Math.min(result._score / 1000, 1); // Normalize score
//     }
//     // Fallback: newer cases are more relevant
//     const year = result.year || 2000;
//     const currentYear = new Date().getFullYear();
//     return Math.max(0.1, 1 - (currentYear - year) / 50);
//   }

//   static async searchStatutes(query: string, limit: number = 10): Promise<KenyaLawStatute[]> {
//     // For now, return mock statutes since the API doesn't seem to have separate statute search
//     console.log(`Searching statutes for: ${query}`);
    
//     const queryLower = query.toLowerCase();
    
//     if (queryLower.includes('murder')) {
//       return [
//         {
//           id: '1',
//           title: 'Penal Code',
//           section: 'Section 203 - Murder',
//           content: 'Any person who of malice aforethought causes death of another person by an unlawful act or omission is guilty of murder.',
//           chapter: 'Chapter XVI - Offences Against the Person',
//           relevance: 0.92
//         }
//       ];
//     } else if (queryLower.includes('robbery')) {
//       return [
//         {
//           id: '2',
//           title: 'Penal Code',
//           section: 'Section 296 - Robbery with Violence',
//           content: 'Any person who commits robbery and at or immediately before or immediately after the time of the robbery, wounds, beats, strikes or uses other personal violence to any person, is guilty of a felony.',
//           chapter: 'Chapter XVII - Offences Against Property',
//           relevance: 0.95
//         }
//       ];
//     } else if (queryLower.includes('divorce')) {
//       return [
//         {
//           id: '3',
//           title: 'Marriage Act',
//           section: 'Section 66 - Grounds for Divorce',
//           content: 'A petition for divorce may be presented to the court by either party to a marriage on the ground that the marriage has irretrievably broken down.',
//           chapter: 'Chapter IV - Divorce',
//           relevance: 0.88
//         }
//       ];
//     }
    
//     return [
//       {
//         id: '1',
//         title: 'Penal Code',
//         section: 'Section 203 - Murder',
//         content: 'Any person who of malice aforethought causes death of another person by an unlawful act or omission is guilty of murder.',
//         chapter: 'Chapter XVI - Offences Against the Person',
//         relevance: 0.92
//       },
//       {
//         id: '2',
//         title: 'Criminal Procedure Code',
//         section: 'Section 137 - Charge and Information',
//         content: 'Every charge or information shall contain, and shall be sufficient if it contains, a statement of the specific offence or offences with which the accused person is charged.',
//         chapter: 'Chapter X - Charge and Information',
//         relevance: 0.85
//       }
//     ];
//   }

//   static async getCaseById(id: string): Promise<KenyaLawCase | null> {
//     try {
//       console.log(`Fetching case: ${id}`);
      
//       // Search for the specific case by ID
//       const cases = await this.searchCases(id, 1);
//       return cases.find(case_ => case_.id === id) || cases[0] || null;
//     } catch (error) {
//       console.error('Error fetching case:', error);
//       return null;
//     }
//   }

//   static async getStatuteById(id: string): Promise<KenyaLawStatute | null> {
//     // Mock response for statutes
//     console.log(`Fetching statute: ${id}`);
    
//     return {
//       id,
//       title: 'Penal Code',
//       section: 'Section 203 - Murder',
//       content: 'Any person who of malice aforethought causes death of another person by an unlawful act or omission is guilty of murder.',
//       chapter: 'Chapter XVI - Offences Against the Person',
//       relevance: 0.92
//     };
//   }

//   static async searchAll(query: string): Promise<KenyaLawSearchResult> {
//     const [cases, statutes] = await Promise.all([
//       this.searchCases(query),
//       this.searchStatutes(query)
//     ]);

//     return {
//       cases,
//       statutes,
//       totalResults: cases.length + statutes.length,
//       searchQuery: query
//     };
//   }
// }
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class KenyaLawAPI {
  private static baseUrl = `${API_BASE_URL}/kenyalaw`;

  static async searchCases(
  query: string,
  limit: number = 10,
  page: number = 1,
  courtFilter?: string,
  yearFilter?: string
): Promise<{ cases: KenyaLawCase[]; totalResults: number }> {
  try {
    const params = new URLSearchParams({
      search_term: query,
      page: page.toString(),
      page_size: limit.toString(),
      use_cache: 'true',
      cache_max_age_hours: '24'
    });
    if (courtFilter) params.append('court_filter', courtFilter);
    if (yearFilter) params.append('year_filter', yearFilter);

    const fullUrl = `${this.baseUrl}/search?${params.toString()}`;
    const response = await fetch(fullUrl, { method: 'GET', headers: { Accept: 'application/json' } });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: any = await response.json();

    const cases = data.results.map((result: any, index: number) => ({
      id: result.id || index.toString(),
      title: result.title || 'Untitled Case',
      citation: result.citation || result.title || 'No Citation',
      year: result.year?.toString() || 'Unknown',
      court: result.court || 'Unknown Court',
      summary: result.summary || '',
      fullText: result.full_text || '',
      keywords: result.keywords || [],
      relevance: result.relevance || 0.5,
      doc_type: result.doc_type,
      date: result.date,
      jurisdiction: result.jurisdiction,
      judges: result.judges,
      case_number: result.case_number,
      nature: result.nature,
      registry: result.registry
    }));

    return {
      cases,
      totalResults: data.count || data.totalResults || 0
    };
  } catch (error) {
    console.error('Error searching Kenya Law cases:', error);
    return { cases: [], totalResults: 0 };
  }
}


  static async searchStatutes(
    query: string,
    limit: number = 10,
    page: number = 1
  ): Promise<KenyaLawStatute[]> {
    try {
      const params = new URLSearchParams({
        search_term: query,
        page: page.toString(),
        page_size: limit.toString(),
        use_cache: 'true',
        cache_max_age_hours: '24'
      });

      const fullUrl = `${this.baseUrl}/statutes?${params.toString()}`;
      const response = await fetch(fullUrl, { method: 'GET', headers: { Accept: 'application/json' } });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: any = await response.json();

      return data.results.map((statute: any, index: number) => ({
        id: statute.id || index.toString(),
        title: statute.title || 'Untitled Statute',
        section: statute.section || '',
        content: statute.content || '',
        chapter: statute.chapter || '',
        relevance: statute.relevance || 0.5
      }));
    } catch (error) {
      console.error('Error searching Kenya Law statutes:', error);
      return [];
    }
  }

  static async searchAll(query: string): Promise<KenyaLawSearchResult> {
    const [cases, statutes] = await Promise.all([
      this.searchCases(query),
      this.searchStatutes(query)
    ]);

    return {
      cases,
      statutes,
      totalResults: cases.length + statutes.length,
      searchQuery: query
    };
  }
}


// GPT Integration for legal analysis
export class LegalGPTService {
  // Remove environment variable dependency for browser compatibility
  private static apiKey = typeof window !== 'undefined' ? '' : process.env.OPENAI_API_KEY || '';
  private static baseUrl = 'https://api.openai.com/v1';

  static async analyzeCase(
    caseType: string, 
    kenyaLawData: KenyaLawSearchResult
  ): Promise<string> {
    // This would integrate with OpenAI GPT API
    console.log(`Analyzing ${caseType} with GPT using Kenya Law data`);
    
    // Mock GPT response for now
    return `Based on the Kenya Law database analysis for ${caseType}, here are the key legal points:

1. **Legal Framework**: ${caseType} is governed by specific provisions in the Penal Code and related statutes.

2. **Key Elements**: The prosecution must prove beyond reasonable doubt that the accused committed the offence with the required mental state.

3. **Recent Case Law**: Recent decisions from the High Court and Court of Appeal provide important precedents for sentencing and procedural matters.

4. **Defenses Available**: Common defenses include lack of intent, alibi, and procedural irregularities.

5. **Sentencing Guidelines**: The courts have established sentencing guidelines that consider aggravating and mitigating factors.

This analysis is based on ${kenyaLawData.totalResults} relevant cases and statutes from the Kenya Law database.`;
  }

  static async generateLegalAdvice(
    question: string,
    context: KenyaLawSearchResult
  ): Promise<string> {
    // This would integrate with OpenAI GPT API
    console.log(`Generating legal advice for: ${question}`);
    
    // Mock GPT response
    return `Based on Kenyan law and the relevant cases and statutes, here's my analysis:

**Question**: ${question}

**Legal Analysis**: 
The applicable law provides clear guidance on this matter. Based on the recent case law and statutory provisions, the key considerations are:

1. **Statutory Requirements**: The relevant statute sets out the specific elements that must be proven.

2. **Case Law Precedent**: Recent decisions provide important guidance on interpretation and application.

3. **Procedural Considerations**: The proper procedure must be followed to ensure the case is handled correctly.

4. **Practical Advice**: Based on the legal framework, here are the recommended steps...

This advice is generated using AI analysis of the Kenya Law database and should be verified with a qualified legal professional.`;
  }

  static async summarizeCase(caseData: KenyaLawCase): Promise<string> {
    // This would integrate with OpenAI GPT API
    console.log(`Summarizing case: ${caseData.title}`);
    
    // Mock GPT response
    return `**Case Summary**: ${caseData.title}

**Court**: ${caseData.court}
**Year**: ${caseData.year}
**Citation**: ${caseData.citation}

**Key Points**:
- This case addresses important legal principles regarding ${caseData.keywords.join(', ')}
- The court's decision provides guidance for future similar cases
- The judgment clarifies the interpretation of relevant statutory provisions

**Practical Impact**:
This case is highly relevant for legal practitioners handling similar matters and provides important precedent for future cases.`;
  }
}

// Utility functions for the CaseDialog component
export const legalAnalysisHelpers = {
  // Get relevant cases for a specific legal issue
  async getRelevantCases(legalIssue: string): Promise<KenyaLawCase[]> {
    return await KenyaLawAPI.searchCases(legalIssue, 5);
  },

  // Get relevant statutes for a specific legal issue
  async getRelevantStatutes(legalIssue: string): Promise<KenyaLawStatute[]> {
    return await KenyaLawAPI.searchStatutes(legalIssue, 5);
  },

  // Generate comprehensive legal analysis
  async generateAnalysis(caseType: string): Promise<string> {
    const searchResult = await KenyaLawAPI.searchAll(caseType);
    return await LegalGPTService.analyzeCase(caseType, searchResult);
  },

  // Get quick legal advice
  async getQuickAdvice(question: string): Promise<string> {
    const searchResult = await KenyaLawAPI.searchAll(question);
    return await LegalGPTService.generateLegalAdvice(question, searchResult);
  }
}; 