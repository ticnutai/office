import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GradientButton } from "@/components/ui/gradient-button";
import { ProgressCard } from "@/components/ui/progress-card";
import { DataTable } from "@/components/ui/data-table";
import { ElementInspector } from "@/components/ui/element-inspector";
import { ChartLine, Download, Settings, Cog, UserPlus, Plus, X, Filter, Calendar } from "lucide-react";
import { DashboardItem, ProgressGroup, insertDashboardItemSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const { toast } = useToast();

  const { data: dashboardItems = [], isLoading: itemsLoading } = useQuery<DashboardItem[]>({
    queryKey: ['/api/dashboard-items'],
  });

  const { data: progressGroups = [], isLoading: groupsLoading } = useQuery<ProgressGroup[]>({
    queryKey: ['/api/progress-groups'],
  });

  const addForm = useForm({
    resolver: zodResolver(insertDashboardItemSchema),
    defaultValues: {
      site: "",
      status: "",
      date: "",
      contactName: "",
      clientName: ""
    }
  });

  const editForm = useForm({
    resolver: zodResolver(insertDashboardItemSchema),
    defaultValues: {
      site: "",
      status: "",
      date: "",
      contactName: "",
      clientName: ""
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/dashboard-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to add item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-items'] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({ title: "נוסף בהצלחה", description: "הפריט נוסף למערכת" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await fetch(`/api/dashboard-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-items'] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      editForm.reset();
      toast({ title: "עודכן בהצלחה", description: "הפריט עודכן במערכת" });
    }
  });

  // Button Functions
  const handleOverview = () => {
    toast({ title: "סקירה כללית", description: "מציג דוח סקירה כולל של המערכת" });
  };

  const handleBuildReport = () => {
    toast({ title: "בנייה קריאה", description: "יוצר דוח בנייה מתקדם" });
  };

  const handleExcelExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "אתר,סטטוס,תאריך,איש קשר,לקוח\n" +
      dashboardItems.map(item => 
        `"${item.site}","${item.status}","${item.date}","${item.contactName}","${item.clientName}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "יצוא Excel", description: "הקובץ הורד בהצלחה" });
  };

  const handleCsvExport = () => {
    const jsonData = JSON.stringify(dashboardItems, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dashboard_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "יצוא CSV", description: "הקובץ הורד בהצלחה" });
  };

  const handleExportSettings = () => {
    toast({ title: "הגדרות יצוא", description: "פותח חלון הגדרות יצוא מתקדמות" });
  };

  const handleAdvancedSettings = () => {
    toast({ title: "מצב עריכה מתקדם", description: "לחץ על כפתור Inspector בתחתית המסך כדי להפעיל עריכת אלמנטים בזמן אמת" });
  };

  const handleAddUser = () => {
    toast({ title: "הוסף משתמש", description: "פותח טופס הוספת משתמש חדש" });
  };

  const handleAddGreen = () => {
    setIsAddDialogOpen(true);
  };

  const handleCancel = () => {
    toast({ title: "בטל הכנסה", description: "הפעולה בוטלה" });
  };

  const handleEdit = (item: DashboardItem) => {
    setEditingItem(item);
    editForm.reset({
      site: item.site,
      status: item.status,
      date: item.date,
      contactName: item.contactName,
      clientName: item.clientName
    });
    setIsEditDialogOpen(true);
  };

  const onAddSubmit = (data: any) => {
    addMutation.mutate(data);
  };

  const onEditSubmit = (data: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    }
  };

  if (itemsLoading || groupsLoading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50" dir="rtl">
      {/* Header with Action Buttons */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-right">ניהול מתקדמים לכל הלקוח</h1>
          
          <div className="flex flex-wrap gap-3 justify-start">
            <GradientButton type="overview" onClick={handleOverview}>
              <ChartLine className="h-4 w-4" />
              <span>סקירה כללית</span>
            </GradientButton>
            
            <GradientButton type="build" onClick={handleBuildReport}>
              <Download className="h-4 w-4" />
              <span>בנייה קריאה</span>
            </GradientButton>
            
            <GradientButton type="excel" onClick={handleExcelExport}>
              <Download className="h-4 w-4" />
              <span>Excel יצוא</span>
            </GradientButton>
            
            <GradientButton type="csv" onClick={handleCsvExport}>
              <Download className="h-4 w-4" />
              <span>CSV יצוא</span>
            </GradientButton>
            
            <GradientButton type="settings" onClick={handleExportSettings}>
              <Settings className="h-4 w-4" />
              <span>הגדרות יצוא</span>
            </GradientButton>
            
            <GradientButton type="advanced" onClick={handleAdvancedSettings}>
              <Cog className="h-4 w-4" />
              <span>הגדרות מתקדמות</span>
            </GradientButton>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Form Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {/* Date Start Field */}
            <div className="relative">
              <Label className="block text-sm font-medium text-gray-700 mb-2 text-right">תאריך התחלה</Label>
              <div className="relative">
                <Input 
                  type="date" 
                  className="text-right pr-10"
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            {/* Date End Field */}
            <div className="relative">
              <Label className="block text-sm font-medium text-gray-700 mb-2 text-right">תאריך סיום</Label>
              <div className="relative">
                <Input 
                  type="date" 
                  className="text-right pr-10"
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            {/* Name Start Field */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2 text-right">שם התחלה</Label>
              <Input 
                type="text" 
                className="text-right"
                placeholder="הזן שם התחלה"
              />
            </div>
            
            {/* Name End Field */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2 text-right">שם סיום</Label>
              <Input 
                type="text" 
                className="text-right"
                placeholder="הזן שם סיום"
              />
            </div>
            
            {/* History Field */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2 text-right">היסטוריה מעודכנת</Label>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="בחר אפשרות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">אחרון</SelectItem>
                  <SelectItem value="week">שבוע אחרון</SelectItem>
                  <SelectItem value="month">חודש אחרון</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filter Button */}
            <div className="flex items-end">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
                <Filter className="h-4 w-4 ml-2" />
                <span>סינון</span>
              </Button>
            </div>
          </div>
          
          {/* Advanced Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* All Categories Dropdown */}
            <div>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="כל הקטגוריות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category-a">קטגוריה א</SelectItem>
                  <SelectItem value="category-b">קטגוריה ב</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* All Locations Dropdown */}
            <div>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="כל המקומות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tel-aviv">תל אביב</SelectItem>
                  <SelectItem value="jerusalem">ירושלים</SelectItem>
                  <SelectItem value="haifa">חיפה</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort Dropdown */}
            <div>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="מיון" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-new">תאריך - חדש לישן</SelectItem>
                  <SelectItem value="date-old">תאריך - ישן לחדש</SelectItem>
                  <SelectItem value="name-asc">שם א-ת</SelectItem>
                  <SelectItem value="name-desc">שם ת-א</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {progressGroups.map((group) => (
          <ProgressCard
            key={group.id}
            title={group.name}
            completed={group.completed}
            total={group.total}
            percentage={group.percentage}
            type={group.percentage === 100 ? "group-b" : "group-a"}
          />
        ))}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-3 mb-6 justify-start">
        <Button onClick={handleAddUser} className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-200">
          <UserPlus className="h-4 w-4 ml-2" />
          <span>הוסף משתמש</span>
        </Button>
        
        <Button onClick={handleAddGreen} className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-200">
          <Plus className="h-4 w-4 ml-2" />
          <span>הוסף ירוק</span>
        </Button>
        
        <Button onClick={handleCancel} className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
          <X className="h-4 w-4 ml-2" />
          <span>בטל הכנסה</span>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable data={dashboardItems} onEdit={handleEdit} />

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">הוסף פריט חדש</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">אתר</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" placeholder="הזן שם האתר" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">סטטוס</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="בחר סטטוס" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="בטיפול">בטיפול</SelectItem>
                        <SelectItem value="הושלם">הושלם</SelectItem>
                        <SelectItem value="נדרש טיפול">נדרש טיפול</SelectItem>
                        <SelectItem value="בביקורת">בביקורת</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">תאריך</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">שם איש קשר</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" placeholder="הזן שם איש הקשר" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">שם הלקוח</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" placeholder="הזן שם הלקוח" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "מוסיף..." : "הוסף"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">ערוך פריט</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">אתר</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" placeholder="הזן שם האתר" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">סטטוס</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="בחר סטטוס" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="בטיפול">בטיפול</SelectItem>
                        <SelectItem value="הושלם">הושלם</SelectItem>
                        <SelectItem value="נדרש טיפול">נדרש טיפול</SelectItem>
                        <SelectItem value="בביקורת">בביקורת</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">תאריך</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">שם איש קשר</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" placeholder="הזן שם איש הקשר" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">שם הלקוח</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" placeholder="הזן שם הלקוח" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "מעדכן..." : "עדכן"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <Card className="mt-6">
        <CardContent className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            <span>מציג 1-{dashboardItems.length} מתוך {dashboardItems.length} תוצאות</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="px-3 py-1 text-sm">
              <span>‹</span>
            </Button>
            <Button size="sm" className="px-3 py-1 text-sm bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm" className="px-3 py-1 text-sm">2</Button>
            <Button variant="outline" size="sm" className="px-3 py-1 text-sm">3</Button>
            <span className="px-2 text-sm text-gray-500">...</span>
            <Button variant="outline" size="sm" className="px-3 py-1 text-sm">5</Button>
            <Button variant="outline" size="sm" className="px-3 py-1 text-sm">
              <span>›</span>
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
