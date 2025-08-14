import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Phone,
  Video,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock3
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'hearing' | 'consultation' | 'deadline' | 'court';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  attendees: string[];
  location: string;
  isVirtual: boolean;
  caseId?: string;
  clientId?: string;
}

const LawyerCalendar = () => {
  const { hasRole } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Mock data
  const events: Event[] = [
    {
      id: '1',
      title: 'Client Consultation - Sarah Johnson',
      description: 'Initial consultation for employment discrimination case',
      startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 10, 0),
      endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 11, 0),
      type: 'consultation',
      status: 'confirmed',
      attendees: ['Sarah Johnson', 'You'],
      location: 'Conference Room A',
      isVirtual: false,
      caseId: 'CASE-001',
      clientId: 'CLIENT-001'
    },
    {
      id: '2',
      title: 'Court Hearing - Smith vs. Corporation',
      description: 'Motion hearing for summary judgment',
      startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 14, 30),
      endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 16, 0),
      type: 'hearing',
      status: 'scheduled',
      attendees: ['Judge Wilson', 'Opposing Counsel', 'You'],
      location: 'Courtroom 3B',
      isVirtual: false,
      caseId: 'CASE-002'
    },
    {
      id: '3',
      title: 'Document Review Deadline',
      description: 'Deadline to review and submit discovery responses',
      startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2, 17, 0),
      endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2, 17, 0),
      type: 'deadline',
      status: 'scheduled',
      attendees: ['You'],
      location: 'Office',
      isVirtual: false,
      caseId: 'CASE-003'
    },
    {
      id: '4',
      title: 'Virtual Client Meeting - Michael Chen',
      description: 'Follow-up meeting to discuss settlement offer',
      startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 15, 0),
      endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 16, 0),
      type: 'meeting',
      status: 'confirmed',
      attendees: ['Michael Chen', 'You'],
      location: 'Zoom Meeting',
      isVirtual: true,
      caseId: 'CASE-004',
      clientId: 'CLIENT-002'
    }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'hearing': return 'bg-red-500';
      case 'consultation': return 'bg-green-500';
      case 'deadline': return 'bg-orange-500';
      case 'court': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Clock3 className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => event.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5);
  };

  const getTodayEvents = () => {
    const today = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === today.toDateString();
    });
  };

  if (!hasRole(['lawyer'])) {
    return (
      <DashboardLayout title="Calendar">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. This page is for lawyers only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Manage your appointments and deadlines</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAddEvent(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Calendar</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
                    </span>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <p>Calendar view will be implemented here</p>
                    <p className="text-sm">Showing {view} view</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTodayEvents().length > 0 ? (
                    getTodayEvents().map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`} />
                              <p className="text-sm font-medium">{event.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </p>
                            <div className="flex items-center space-x-2">
                              {event.isVirtual ? (
                                <Video className="h-3 w-3 text-blue-500" />
                              ) : (
                                <MapPin className="h-3 w-3 text-gray-500" />
                              )}
                              <span className="text-xs text-muted-foreground">{event.location}</span>
                            </div>
                          </div>
                          {getStatusIcon(event.status)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No events scheduled for today
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUpcomingEvents().map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`} />
                            <p className="text-sm font-medium">{event.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {formatDate(event.startTime)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                        {getStatusIcon(event.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Video Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Deadline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Details Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-md">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                  <DialogDescription>
                    {selectedEvent.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDate(selectedEvent.startTime)} at {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedEvent.isVirtual ? (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedEvent.attendees.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedEvent.status)}
                    <span className="text-sm capitalize">{selectedEvent.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedEvent.type}</Badge>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1">Edit Event</Button>
                    <Button variant="outline" className="flex-1">Reschedule</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Event Dialog */}
        <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new appointment or deadline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="Enter event title" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter event description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="datetime-local" />
                </div>
              </div>
              <div>
                <Label htmlFor="type">Event Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="hearing">Court Hearing</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="court">Court Appearance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1" onClick={() => setShowAddEvent(false)}>
                  Create Event
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddEvent(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default LawyerCalendar; 