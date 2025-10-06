import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, ShoppingBag, BarChart3, LogOut, Settings, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user, loading, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || userRole !== "clerk_admin")) {
      navigate("/staff-login");
    }
  }, [user, loading, userRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Mr. Bur Dental</h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage clinic operations and analytics</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$0</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="staff" className="gap-2">
                <Users className="h-4 w-4" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="logs" className="gap-2">
                <FileText className="h-4 w-4" />
                Audit Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Manage All Appointments</h3>
                <p className="text-muted-foreground">View and manage appointments for all doctors</p>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Staff Management</h3>
                <p className="text-muted-foreground">Manage doctors and staff members</p>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Billing Management</h3>
                <p className="text-muted-foreground">View and manage all invoices and payments</p>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Product Management</h3>
                <p className="text-muted-foreground mb-4">Add, edit, or remove dental products</p>
                <Button>Add New Product</Button>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Clinic Analytics</h3>
                <p className="text-muted-foreground">View comprehensive clinic performance metrics</p>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
                <p className="text-muted-foreground">Monitor all system activities and changes</p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}