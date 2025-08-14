import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  Plus, 
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock3,
  User,
  FileText,
  MessageSquare
} from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  lawyerName: string;
  lawyerAvatar: string;
  caseTitle: string;
  date: Date;
  duration: number;
  type: 'consultation' | 'meeting' | 'court' | 'follow-up';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  location: string;
  isVirtual: boolean;
  notes: string;
}

const ClientAppointments = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Mock data
  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Initial Consultation',
      lawyerName: 'Attorney Sarah Wilson',
      lawyerAvatar: '/avatars/sarah-wilson.jpg',
      caseTitle: 'Employment Discrimination Case',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      duration: 60,
      type: 'consultation',
      status: 'confirmed',
      location: 'Conference Room A',
      isVirtual: false,
      notes: 'Please bring all relevant documents and be prepared to discuss the timeline of events.'
    },
    {
      id: '2',
      title: 'Case Strategy Meeting',
      lawyerName: 'Attorney David Rodriguez',
      lawyerAvatar: '/avatars/david-rodriguez.jpg',
      caseTitle: 'Contract Dispute Resolution',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      duration: 90,
      type: 'meeting',
      status: 'scheduled',
      location: 'Zoom Meeting',
      isVirtual: true,
      notes: 'Virtual meeting to discuss settlement strategy and next steps.'
    },
    {
      id: '3',
      title: 'Court Hearing',
      lawyerName: 'Attorney Sarah Wilson',
      lawyerAvatar: '/avatars/sarah-wilson.jpg',
      caseTitle: 'Employment Discrimination Case',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
      duration: 120,
      type: 'court',
      status: 'scheduled',
      location: 'Courtroom 3B',
      isVirtual: false,
      notes: 'Motion hearing for summary judgment. Please arrive 30 minutes early.'
    },
    {
      id: '4',
      title: 'Follow-up Consultation',
      lawyerName: 'Attorney David Rodriguez',
      lawyerAvatar: '/avatars/david-rodriguez.jpg',
      caseTitle: 'Contract Dispute Resolution',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      duration: 45,
      type: 'follow-up',
      status: 'completed',
      location: 'Office',
      isVirtual: false,
      notes: 'Review of settlement offer and client decision.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Clock3 className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="h-4 w-4" />;
      case 'meeting': return <MessageSquare className="h-4 w-4" />;
      case 'court': return <FileText className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter(appointment => appointment.date > now && appointment.status !== 'cancelled')
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.lawyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.caseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!hasRole(['client'])) {
    return (
      <DashboardLayout title="Appointments">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. This page is for clients only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Appointments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Manage your legal appointments and consultations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Appointments</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.lawyerAvatar} alt={appointment.lawyerName} />
                            <AvatarFallback>
                              {appointment.lawyerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{appointment.title}</h3>
                              {getTypeIcon(appointment.type)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{appointment.lawyerName}</p>
                            <p className="text-sm text-muted-foreground mb-2">{appointment.caseTitle}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(appointment.date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(appointment.date)} ({appointment.duration}min)</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {appointment.isVirtual ? (
                                  <Video className="h-4 w-4" />
                                ) : (
                                  <MapPin className="h-4 w-4" />
                                )}
                                <span>{appointment.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(appointment.status)}
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUpcomingAppointments().map((appointment) => (
                    <div key={appointment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{appointment.title}</p>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{appointment.lawyerName}</p>
                      <p className="text-xs text-muted-foreground mb-2">{appointment.caseTitle}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(appointment.date)}</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(appointment.date)}</span>
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
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Virtual Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Appointments</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold text-green-600">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Upcoming</span>
                    <span className="font-semibold text-blue-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointment Details Dialog */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Appointment Details</h2>
                <Button variant="ghost" onClick={() => setSelectedAppointment(null)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedAppointment.lawyerAvatar} alt={selectedAppointment.lawyerName} />
                    <AvatarFallback>
                      {selectedAppointment.lawyerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedAppointment.lawyerName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.caseTitle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(selectedAppointment.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatTime(selectedAppointment.date)} ({selectedAppointment.duration} minutes)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedAppointment.isVirtual ? (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{selectedAppointment.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedAppointment.status)}
                    <Badge className={getStatusColor(selectedAppointment.status)}>
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Notes</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientAppointments; 