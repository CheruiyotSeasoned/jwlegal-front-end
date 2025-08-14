import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, BookOpen, Calendar, MapPin, Scale } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const JudicialPrecedents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const precedents = [
    {
      id: 1,
      title: 'Constitutional Rights in Criminal Proceedings',
      caseNumber: 'Petition No. 123 of 2023',
      court: 'Supreme Court of Kenya',
      date: '2023-12-15',
      category: 'Constitutional Law',
      summary: 'Landmark decision on the right to fair trial and due process in criminal proceedings.',
      relevance: 'High',
      citations: 45
    },
    {
      id: 2,
      title: 'Environmental Protection and Development Rights',
      caseNumber: 'Civil Appeal No. 456 of 2022',
      court: 'Court of Appeal',
      date: '2022-11-20',
      category: 'Environmental Law',
      summary: 'Balancing environmental protection with economic development rights.',
      relevance: 'Medium',
      citations: 23
    },
    {
      id: 3,
      title: 'Employment Discrimination and Equal Pay',
      caseNumber: 'Employment and Labour Relations Court No. 789 of 2023',
      court: 'Employment and Labour Relations Court',
      date: '2023-10-10',
      category: 'Employment Law',
      summary: 'Precedent setting case on gender-based pay discrimination in the workplace.',
      relevance: 'High',
      citations: 67
    },
    {
      id: 4,
      title: 'Property Rights and Eminent Domain',
      caseNumber: 'Civil Case No. 321 of 2022',
      court: 'High Court',
      date: '2022-09-05',
      category: 'Property Law',
      summary: 'Compensation standards for government acquisition of private property.',
      relevance: 'Medium',
      citations: 34
    },
    {
      id: 5,
      title: 'Digital Privacy and Data Protection',
      caseNumber: 'Petition No. 654 of 2023',
      court: 'High Court',
      date: '2023-08-15',
      category: 'Technology Law',
      summary: 'First major case interpreting the Data Protection Act in Kenya.',
      relevance: 'High',
      citations: 89
    }
  ];

  const categories = [
    'all',
    'Constitutional Law',
    'Criminal Law',
    'Civil Law',
    'Employment Law',
    'Property Law',
    'Environmental Law',
    'Technology Law',
    'Family Law',
    'Commercial Law'
  ];

  const filteredPrecedents = precedents.filter(precedent => {
    const matchesSearch = precedent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         precedent.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         precedent.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || precedent.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout title="Case Precedents - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Case Precedents</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Search and review landmark legal decisions and precedents
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Precedents</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search precedents by title, case number, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Precedents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredPrecedents.map((precedent) => (
            <Card key={precedent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{precedent.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <Badge variant="outline" className="w-fit text-xs">
                          {precedent.category}
                        </Badge>
                        <Badge
                          variant={
                            precedent.relevance === 'High' ? 'default' :
                            precedent.relevance === 'Medium' ? 'secondary' : 'outline'
                          }
                          className="w-fit text-xs"
                        >
                          {precedent.relevance} Relevance
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span className="truncate">{precedent.caseNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{precedent.court}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(precedent.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{precedent.citations} citations</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {precedent.summary}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrecedents.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No precedents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find relevant precedents.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JudicialPrecedents; 