import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Users, 
  Scale, 
  BookOpen, 
  Star, 
  Hash, 
  Link,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  User,
  Building,
  Gavel,
  Tag,
  Bookmark,
  Clock,
  Info,
  ExternalLink
} from 'lucide-react';

interface CaseDetailsDisplayProps {
  caseData: any; // The KenyaLawCase object from your fetchCaseDetails
  isLoading?: boolean;
}

const CaseDetailsDisplay: React.FC<CaseDetailsDisplayProps> = ({ caseData, isLoading = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    parties: true,
    references: false,
    fullText: false,
    explainers: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800">Case Not Found</h3>
          <p className="text-red-600">The requested case details could not be loaded.</p>
        </div>
      </div>
    );
  }

  const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );

  const ExpandableSection = ({ title, icon: Icon, children, sectionKey, badge = null }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
            {badge && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                {badge}
              </span>
            )}
          </div>
          {expandedSections[sectionKey] ? 
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> : 
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          }
        </div>
      </button>
      {expandedSections[sectionKey] && (
        <div className="p-4 sm:p-6">
          {children}
        </div>
      )}
    </div>
  );

  const RelevanceBar = ({ score }) => {
    const percentage = Math.min(score * 100, 100);
    const getColor = (score) => {
      if (score >= 0.8) return 'bg-green-500';
      if (score >= 0.6) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getColor(score)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-600">
          {(score * 100).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
                {caseData.title || 'Untitled Case'}
              </h1>
              <div className="flex flex-wrap gap-3 text-blue-100">
                {caseData.citation && (
                  <div className="flex items-center space-x-2">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm">{caseData.citation}</span>
                  </div>
                )}
                {caseData.year && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{caseData.year}</span>
                  </div>
                )}
                {caseData.court && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{caseData.court}</span>
                  </div>
                )}
              </div>
            </div>
            {caseData.relevance && (
              <div className="bg-white/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">Relevance</span>
                </div>
                <RelevanceBar score={caseData.relevance} />
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Info Bar */}
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {caseData.id && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Hash className="h-4 w-4" />
                <span>ID: {caseData.id}</span>
              </div>
            )}
            {caseData.dateDelivered && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{new Date(caseData.dateDelivered).toLocaleDateString()}</span>
              </div>
            )}
            {caseData.registry && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="sm:truncate">{caseData.registry}</span>
              </div>
            )}
            {caseData.caseNumber?.length > 0 && (
              <div className="flex items-center space-x-2 text-gray-600">
                <FileText className="h-4 w-4" />
                <span className="sm:truncate">{caseData.caseNumber[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {caseData.summary && (
            <InfoCard title="Case Summary" icon={FileText}>
              <p className="text-gray-700 leading-relaxed">{caseData.summary}</p>
            </InfoCard>
          )}

       {caseData.overview && (
  <ExpandableSection title="Case Overview" icon={Eye} sectionKey="overview">
    <div 
      className="prose max-w-none text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: caseData.overview }}
    />
  </ExpandableSection>
)}


          {caseData.parties && (
            <ExpandableSection title="Parties" icon={Users} sectionKey="parties">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseData.parties.plaintiff?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Plaintiff{caseData.parties.plaintiff.length > 1 ? 's' : ''}
                    </h4>
                    <ul className="space-y-2">
                      {caseData.parties.plaintiff.map((party, idx) => (
                        <li key={idx} className="bg-blue-50 rounded-lg px-3 py-2 text-gray-700">
                          {party}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {caseData.parties.defendant?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-red-600" />
                      Defendant{caseData.parties.defendant.length > 1 ? 's' : ''}
                    </h4>
                    <ul className="space-y-2">
                      {caseData.parties.defendant.map((party, idx) => (
                        <li key={idx} className="bg-red-50 rounded-lg px-3 py-2 text-gray-700">
                          {party}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ExpandableSection>
          )}

          {(caseData.precedents?.length > 0 || caseData.legislation?.length > 0 || caseData.judgmentReferences?.length > 0) && (
            <ExpandableSection 
              title="Legal References" 
              icon={BookOpen} 
              sectionKey="references"
              badge={`${(caseData.precedents?.length || 0) + (caseData.legislation?.length || 0) + (caseData.judgmentReferences?.length || 0)} items`}
            >
              <div className="space-y-6">
                {caseData.precedents?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Gavel className="h-4 w-4 mr-2 text-purple-600" />
                      Precedents ({caseData.precedents.length})
                    </h4>
                    <ul className="space-y-2">
                      {caseData.precedents.map((precedent, idx) => (
                        <li key={idx} className="bg-purple-50 rounded-lg px-3 py-2 text-gray-700 text-sm">
                          {precedent}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {caseData.legislation?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                      Legislation ({caseData.legislation.length})
                    </h4>
                    <ul className="space-y-2">
                      {caseData.legislation.map((law, idx) => (
                        <li key={idx} className="bg-green-50 rounded-lg px-3 py-2 text-gray-700 text-sm">
                          {law}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {caseData.judgmentReferences?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Link className="h-4 w-4 mr-2 text-blue-600" />
                      Other References ({caseData.judgmentReferences.length})
                    </h4>
                    <ul className="space-y-2">
                      {caseData.judgmentReferences.map((ref, idx) => (
                        <li key={idx} className="bg-blue-50 rounded-lg px-3 py-2 text-gray-700 text-sm">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ExpandableSection>
          )}

          {caseData.fullText && (
            <ExpandableSection title="Full Text" icon={FileText} sectionKey="fullText">
              <div className="bg-gray-50 rounded-lg p-4 max-h-[50vh] sm:max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {caseData.fullText}
                </pre>
              </div>
            </ExpandableSection>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InfoCard title="Court Information" icon={Building}>
            <div className="space-y-3">
              {caseData.court && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Court:</span>
                  <p className="text-gray-800">{caseData.court}</p>
                </div>
              )}
              {caseData.judges?.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Judge{caseData.judges.length > 1 ? 's' : ''}:</span>
                  <ul className="mt-1">
                    {caseData.judges.map((judge, idx) => (
                      <li key={idx} className="text-gray-800">{judge}</li>
                    ))}
                  </ul>
                </div>
              )}
              {caseData.attorneys && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Legal Representatives:</span>
                  <p className="text-gray-800">{caseData.attorneys}</p>
                </div>
              )}
            </div>
          </InfoCard>

          {caseData.keywords?.length > 0 && (
            <InfoCard title="Keywords" icon={Tag}>
              <div className="flex flex-wrap gap-2">
                {caseData.keywords.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </InfoCard>
          )}

          {caseData.headnotes && (
            <InfoCard title="Headnotes" icon={Bookmark}>
              <p className="text-gray-700 text-sm leading-relaxed">{caseData.headnotes}</p>
            </InfoCard>
          )}

          {caseData.attachments?.length > 0 && (
            <InfoCard title="Attachments" icon={Download}>
              <div className="space-y-2">
                {caseData.attachments.map((attachment, idx) => (
                  <div key={idx} className="flex flex-wrap items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{attachment.text || `Document ${idx + 1}`}</span>
                    {attachment.url && (
                      <a 
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 mt-2 sm:mt-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {caseData.explainers && (
            <ExpandableSection title="AI Insights" icon={Info} sectionKey="explainers">
              <div className="space-y-4">
                {caseData.explainers.relevance && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-medium text-blue-800 mb-1">Relevance</h5>
                    <p className="text-blue-700 text-sm">{caseData.explainers.relevance}</p>
                  </div>
                )}
                {caseData.explainers.highlight && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <h5 className="font-medium text-yellow-800 mb-1">Search Highlights</h5>
                    <p className="text-yellow-700 text-sm">{caseData.explainers.highlight}</p>
                  </div>
                )}
                {caseData.explainers.case_importance && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <h5 className="font-medium text-green-800 mb-1">Case Importance</h5>
                    <p className="text-green-700 text-sm">{caseData.explainers.case_importance}</p>
                  </div>
                )}
              </div>
            </ExpandableSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsDisplay;
