import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, FileText, Plus, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const JudicialCalendar = () => {
  const [viewFilter, setViewFilter] = useState('all');

  const calendarEvents = [
    {
      id: 1,
      title: 'Criminal Case Hearing - Republic vs. John Doe',
      type: 'Court Hearing',
      date: '2024-01-15',
      time: '09:00 AM',
      duration: '2 hours',
      location: 'Court Room 3, High Court Nairobi',
      status: 'Scheduled',
      priority: 'High',
      caseNumber: 'Criminal Case No. 123 of 2023',
      parties: ['Republic', 'John Doe'],
      description: 'Main hearing for robbery with violence case'
    },
    {
      id: 2,
      title: 'Civil Case Review - Smith vs. Johnson',
      type: 'Case Review',
      date: '2024-01-15',
      time: '02:00 PM',
      duration: '1 hour',
      location: 'Chambers, High Court Nairobi',
      status: 'Scheduled',
      priority: 'Medium',
      caseNumber: 'Civil Case No. 456 of 2023',
      parties: ['Smith', 'Johnson'],
      description: 'Review of preliminary objections'
    },
    {
      id: 3,
      title: 'Judgment Delivery - Environmental Case',
      type: 'Judgment',
      date: '2024-01-16',
      time: '10:00 AM',
      duration: '30 minutes',
      location: 'Court Room 1, High Court Nairobi',
      status: 'Scheduled',
      priority: 'High',
      caseNumber: 'Petition No. 789 of 2023',
      parties: ['Environmental Group', 'County Government'],
      description: 'Delivery of judgment on environmental protection case'
    },
    {
      id: 4,
      title: 'Pre-trial Conference - Commercial Dispute',
      type: 'Conference',
      date: '2024-01-16',
      time: '03:00 PM',
      duration: '1.5 hours',
      location: 'Conference Room A, High Court Nairobi',
      status: 'Scheduled',
      priority: 'Medium',
      caseNumber: 'Commercial Case No. 321 of 2023',
      parties: ['ABC Company', 'XYZ Corporation'],
      description: 'Pre-trial conference to discuss case management'
    },
    {
      id: 5,
      title: 'Appeal Hearing - Constitutional Matter',
      type: 'Appeal Hearing',
      date: '2024-01-17',
      time: '09:30 AM',
      duration: '3 hours',
      location: 'Court Room 2, High Court Nairobi',
      status: 'Scheduled',
      priority: 'High',
      caseNumber: 'Civil Appeal No. 654 of 2023',
      parties: ['Appellant', 'Respondent'],
      description: 'Appeal against constitutional rights violation'
    },
    {
      id: 6,
      title: 'Administrative Meeting - Court Management',
      type: 'Meeting',
      date: '2024-01-17',
      time: '02:00 PM',
      duration: '1 hour',
      location: 'Board Room, High Court Nairobi',
      status: 'Scheduled',
      priority: 'Low',
      caseNumber: 'N/A',
      parties: ['Court Staff', 'Judicial Officers'],
      description: 'Monthly administrative meeting'
    }
  ];

  const eventTypes = [
    'all',
    'Court Hearing',
    'Case Review',
    'Judgment',
    'Conference',
    'Appeal Hearing',
    'Meeting'
  ];

  const filteredEvents = calendarEvents.filter(event => {
    return viewFilter === 'all' || event.type === viewFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'default';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Court Hearing': return <FileText className="h-4 w-4" />;
      case 'Case Review': return <FileText className="h-4 w-4" />;
      case 'Judgment': return <FileText className="h-4 w-4" />;
      case 'Conference': return <User className="h-4 w-4" />;
      case 'Appeal Hearing': return <FileText className="h-4 w-4" />;
      case 'Meeting': return <User className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout title="Judicial Calendar - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Judicial Calendar</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your court schedule, hearings, and appointments
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Select value={viewFilter} onValueChange={setViewFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Events' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(event.type)}
                        <h3 className="font-medium text-sm sm:text-base truncate">{event.title}</h3>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Badge variant="outline" className="w-fit text-xs">
                          {event.type}
                        </Badge>
                        <Badge variant={getPriorityColor(event.priority)} className="w-fit text-xs">
                          {event.priority} Priority
                        </Badge>
                        <Badge variant={getStatusColor(event.status)} className="w-fit text-xs">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time} ({event.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    {event.caseNumber !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{event.caseNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="truncate">{event.parties.join(' vs. ')}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  No events scheduled for the selected criteria.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar Overview
            </CardTitle>
            <CardDescription>Summary of your judicial schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Total Events</p>
                  <p className="text-xs text-muted-foreground">{calendarEvents.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Court Hearings</p>
                  <p className="text-xs text-muted-foreground">
                    {calendarEvents.filter(e => e.type === 'Court Hearing').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <User className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium text-sm">Meetings</p>
                  <p className="text-xs text-muted-foreground">
                    {calendarEvents.filter(e => e.type === 'Meeting').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm">High Priority</p>
                  <p className="text-xs text-muted-foreground">
                    {calendarEvents.filter(e => e.priority === 'High').length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JudicialCalendar; 