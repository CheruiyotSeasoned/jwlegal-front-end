import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Download, 
  Send, 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Invoice {
  id: string;
  clientName: string;
  clientAvatar: string;
  caseTitle: string;
  invoiceNumber: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
  issueDate: Date;
  description: string;
  hours: number;
  rate: number;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

interface TimeEntry {
  id: string;
  clientName: string;
  caseTitle: string;
  description: string;
  hours: number;
  date: Date;
  rate: number;
  isBillable: boolean;
}

const LawyerBilling = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Mock data
  const invoices: Invoice[] = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientAvatar: '/avatars/sarah.jpg',
      caseTitle: 'Employment Discrimination Case',
      invoiceNumber: 'INV-2024-001',
      amount: 2500.00,
      status: 'paid',
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      description: 'Legal services for employment discrimination case',
      hours: 25,
      rate: 250,
      items: [
        { id: '1', description: 'Initial consultation and case review', hours: 2, rate: 250, amount: 500 },
        { id: '2', description: 'Document preparation and filing', hours: 8, rate: 250, amount: 2000 }
      ]
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      clientAvatar: '/avatars/michael.jpg',
      caseTitle: 'Contract Dispute Resolution',
      invoiceNumber: 'INV-2024-002',
      amount: 1800.00,
      status: 'sent',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      description: 'Contract review and negotiation services',
      hours: 12,
      rate: 250,
      items: [
        { id: '1', description: 'Contract analysis and review', hours: 6, rate: 250, amount: 1500 },
        { id: '2', description: 'Negotiation support', hours: 6, rate: 250, amount: 1500 }
      ]
    },
    {
      id: '3',
      clientName: 'Emily Rodriguez',
      clientAvatar: '/avatars/emily.jpg',
      caseTitle: 'Real Estate Transaction',
      invoiceNumber: 'INV-2024-003',
      amount: 3200.00,
      status: 'overdue',
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      description: 'Real estate transaction legal services',
      hours: 16,
      rate: 250,
      items: [
        { id: '1', description: 'Title review and due diligence', hours: 10, rate: 250, amount: 2500 },
        { id: '2', description: 'Contract preparation', hours: 6, rate: 250, amount: 1500 }
      ]
    }
  ];

  const timeEntries: TimeEntry[] = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      caseTitle: 'Employment Discrimination Case',
      description: 'Document review and preparation',
      hours: 2.5,
      date: new Date(),
      rate: 250,
      isBillable: true
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      caseTitle: 'Contract Dispute Resolution',
      description: 'Client consultation meeting',
      hours: 1.0,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      rate: 250,
      isBillable: true
    },
    {
      id: '3',
      clientName: 'Emily Rodriguez',
      caseTitle: 'Real Estate Transaction',
      description: 'Contract review and amendments',
      hours: 3.0,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      rate: 250,
      isBillable: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <Clock3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTotalRevenue = () => {
    return invoices.reduce((total, invoice) => {
      if (invoice.status === 'paid') {
        return total + invoice.amount;
      }
      return total;
    }, 0);
  };

  const getOutstandingAmount = () => {
    return invoices.reduce((total, invoice) => {
      if (invoice.status !== 'paid') {
        return total + invoice.amount;
      }
      return total;
    }, 0);
  };

  const getOverdueAmount = () => {
    return invoices.reduce((total, invoice) => {
      if (invoice.status === 'overdue') {
        return total + invoice.amount;
      }
      return total;
    }, 0);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!hasRole(['lawyer'])) {
    return (
      <DashboardLayout title="Billing">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. This page is for lawyers only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Billing">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Billing & Invoices</h1>
            <p className="text-muted-foreground">Manage your invoices and track payments</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalRevenue())}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">{formatCurrency(getOutstandingAmount())}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">{formatCurrency(getOverdueAmount())}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{formatCurrency(8500)}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoices List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Invoices</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search invoices..."
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
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={invoice.clientAvatar} alt={invoice.clientName} />
                            <AvatarFallback>
                              {invoice.clientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{invoice.clientName}</p>
                            <p className="text-sm text-muted-foreground">{invoice.caseTitle}</p>
                            <p className="text-xs text-muted-foreground">{invoice.invoiceNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(invoice.status)}
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {formatDate(invoice.dueDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Tracking */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Time Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeEntries.map((entry) => (
                    <div key={entry.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{entry.clientName}</p>
                        <Badge variant={entry.isBillable ? "default" : "secondary"}>
                          {entry.isBillable ? 'Billable' : 'Non-billable'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{entry.caseTitle}</p>
                      <p className="text-sm mb-2">{entry.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{entry.hours}h @ {formatCurrency(entry.rate)}/hr</span>
                        <span>{formatCurrency(entry.hours * entry.rate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Entry
                </Button>
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
                    <Clock className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invoice Details Dialog */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Invoice Details</h2>
                <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Number</p>
                    <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(selectedInvoice.amount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{selectedInvoice.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Case</p>
                    <p className="font-medium">{selectedInvoice.caseTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{formatDate(selectedInvoice.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedInvoice.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Invoice Items</p>
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.hours}h @ {formatCurrency(item.rate)}/hr
                          </p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send
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

export default LawyerBilling; 