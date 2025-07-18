import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

const transactionHistory = [
  { id: 1, app: 'GrowMeOrganic', amount: 20, status: 'Approved', date: new Date(2023, 10, 15) },
  { id: 2, app: 'AppCreator', amount: 50, status: 'Paid', date: new Date(2023, 10, 14) },
  { id: 3, app: 'TaskRunner', amount: 15, status: 'Pending', date: new Date(2023, 10, 18) },
  { id: 4, app: 'DataMiner', amount: 100, status: 'Pending', date: new Date(2023, 10, 20) },
  { id: 5, app: 'SocialBoost', amount: 25, status: 'Paid', date: new Date(2023, 9, 28) },
];

const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Paid':
            return 'default'; // Uses accent color via custom css
        case 'Approved':
            return 'secondary';
        case 'Pending':
            return 'outline';
        default:
            return 'destructive';
    }
}

export default function WalletPage() {
  const totalEarnings = transactionHistory
    .filter(t => t.status === 'Paid' || t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <header className="py-2">
        <h1 className="text-2xl font-bold text-center">Wallet</h1>
      </header>

      <Card className="text-center shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-accent">₹{totalEarnings.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-lg font-semibold mb-2 px-1">Task History</h2>
        <Card className="shadow-md rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.app}</TableCell>
                  <TableCell className="text-center">₹{item.amount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getBadgeVariant(item.status)} className={item.status === 'Paid' ? 'bg-accent text-accent-foreground' : ''}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{format(item.date, 'dd MMM, yy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
