import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Building,
  Scale,
  Gavel,
  Home,
  Car,
  Briefcase,
  Heart,
  Shield,
  Save,
  Send,
  Trash2
} from 'lucide-react';

interface CaseSubmission {
  id: string;
  title: string;
  category: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'reviewing' | 'assigned' | 'in-progress';
  submittedDate: Date;
  estimatedBudget: number;
  documents: string[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

const ClientSubmit = () => {
  const { hasRole } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    urgency: 'medium',
    estimatedBudget: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    documents: [] as string[],
    acceptTerms: false,
    acceptPrivacy: false
  });

  const [uploadedDocuments, setUploadedDocuments] = useState([
    { name: 'case_documents.pdf', size: '2.3MB' },
    { name: 'evidence_photos.jpg', size: '1.1MB' }
  ]);

  const categories = [
    { value: 'family', label: 'Family Law', icon: Heart },
    { value: 'criminal', label: 'Criminal Law', icon: Shield },
    { value: 'civil', label: 'Civil Litigation', icon: Scale },
    { value: 'business', label: 'Business Law', icon: Building },
    { value: 'real-estate', label: 'Real Estate', icon: Home },
    { value: 'employment', label: 'Employment Law', icon: Briefcase },
    { value: 'personal-injury', label: 'Personal Injury', icon: Car },
    { value: 'immigration', label: 'Immigration Law', icon: User },
    { value: 'intellectual-property', label: 'Intellectual Property', icon: FileText },
    { value: 'bankruptcy', label: 'Bankruptcy', icon: DollarSign }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Can wait a few weeks' },
    { value: 'medium', label: 'Medium', description: 'Standard timeline' },
    { value: 'high', label: 'High', description: 'Needs attention soon' },
    { value: 'urgent', label: 'Urgent', description: 'Immediate attention required' }
  ];

  const steps = [
    { id: 1, title: 'Case Information', description: 'Basic case details' },
    { id: 2, title: 'Category & Urgency', description: 'Legal area and priority' },
    { id: 3, title: 'Contact Information', description: 'Your contact details' },
    { id: 4, title: 'Documents & Budget', description: 'Upload documents and budget' },
    { id: 5, title: 'Review & Submit', description: 'Final review and submission' }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...fileNames]
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would submit to the backend
    console.log('Submitting case:', formData);
    // Show success message and redirect
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Case Title</Label>
              <Input
                id="title"
                placeholder="Brief description of your legal issue"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide a detailed description of your legal issue, including relevant facts, timeline, and any specific questions you have..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Legal Category</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.category === category.value
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleInputChange('category', category.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Urgency Level</Label>
              <div className="space-y-2 mt-2">
                {urgencyLevels.map((level) => (
                  <div
                    key={level.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.urgency === level.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleInputChange('urgency', level.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{level.label}</p>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      {formData.urgency === level.value && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.contactInfo.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Your address"
                  value={formData.contactInfo.address}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="budget">Estimated Budget (Optional)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter your budget range"
                value={formData.estimatedBudget}
                onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                This helps us match you with appropriate legal services
              </p>
            </div>
            <div>
              <Label>Upload Documents (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </label>
              </div>
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Uploaded Documents:</p>
                  <div className="space-y-1">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Case Title</p>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">
                      {categories.find(c => c.value === formData.category)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgency</p>
                    <Badge variant="outline">
                      {urgencyLevels.find(u => u.value === formData.urgency)?.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">
                      {formData.estimatedBudget ? `$${formData.estimatedBudget}` : 'Not specified'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm mt-1">{formData.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm">{formData.contactInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{formData.contactInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{formData.contactInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm">{formData.contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!hasRole(['client'])) {
    return (
      <DashboardLayout title="Submit New Case">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. This page is for clients only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Submit New Case">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Submit New Case</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Submit your legal matter for review and assignment to a qualified lawyer
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Submit Case</span>
              <span className="sm:hidden">Submit</span>
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Case Information</span>
                <span>Step 1 of 4</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Case Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Case Information
            </CardTitle>
            <CardDescription>
              Provide basic information about your legal matter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="caseTitle">Case Title</Label>
                <Input 
                  id="caseTitle"
                  placeholder="Brief title describing your legal matter"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="caseType">Case Type</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family Law</SelectItem>
                    <SelectItem value="criminal">Criminal Law</SelectItem>
                    <SelectItem value="civil">Civil Law</SelectItem>
                    <SelectItem value="business">Business Law</SelectItem>
                    <SelectItem value="real-estate">Property Law</SelectItem>
                    <SelectItem value="employment">Employment Law</SelectItem>
                    <SelectItem value="personal-injury">Personal Injury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Case Description</Label>
              <Textarea 
                id="description"
                placeholder="Provide a detailed description of your legal matter, including relevant facts, dates, and circumstances..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Estimated Budget (KSh)</Label>
                <Input 
                  id="budget"
                  placeholder="Your budget range"
                  value={formData.estimatedBudget}
                  onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your contact and personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName"
                  placeholder="Your full legal name"
                  value={formData.contactInfo.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  placeholder="+254 700 000 000"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  placeholder="City, County"
                  value={formData.contactInfo.address}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea 
                id="address"
                placeholder="Your complete residential address"
                rows={2}
                value={formData.contactInfo.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Case Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Case Details
            </CardTitle>
            <CardDescription>
              Additional information about your case
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incidentDate">Incident Date</Label>
                <Input 
                  id="incidentDate"
                  type="date"
                />
              </div>
              <div>
                <Label htmlFor="court">Court (if applicable)</Label>
                <Input 
                  id="court"
                  placeholder="Court name and location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="caseNumber">Case Number (if any)</Label>
                <Input 
                  id="caseNumber"
                  placeholder="Existing case number"
                />
              </div>
              <div>
                <Label htmlFor="opposingParty">Opposing Party</Label>
                <Input 
                  id="opposingParty"
                  placeholder="Name of opposing party"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea 
                id="additionalInfo"
                placeholder="Any additional information that might be relevant to your case..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Documents Upload
            </CardTitle>
            <CardDescription>
              Upload relevant documents to support your case
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
              </p>
              <Button variant="outline" className="mt-4">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Uploaded Documents</Label>
              <div className="space-y-2">
                {uploadedDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Terms and Conditions
            </CardTitle>
            <CardDescription>
              Please review and accept the terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm">
                  I accept the terms and conditions
                </Label>
                <p className="text-xs text-muted-foreground">
                  By submitting this case, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="privacy"
                checked={formData.acceptPrivacy}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptPrivacy: checked as boolean }))}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="privacy" className="text-sm">
                  I consent to data processing
                </Label>
                <p className="text-xs text-muted-foreground">
                  You consent to the processing of your personal data in accordance with Kenya's Data Protection Act.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button className="w-full sm:w-auto">
            <Send className="h-4 w-4 mr-2" />
            Submit Case
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientSubmit; 