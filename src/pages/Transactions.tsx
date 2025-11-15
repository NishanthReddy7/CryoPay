import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, Search, Download, Filter } from "lucide-react";
import DashboardLayout from '../components/DashboardLayout';

const allTransactions = [
  { id: '1', type: 'Sent', to: 'E-Shop', date: 'Oct 13, 2025 at 8:30 PM', amountUSD: -50.00, amountCrypto: -0.016, crypto: 'ETH', status: 'Completed', txHash: '0xabc...123' },
  { id: '2', type: 'Received', from: '0x123...456', date: 'Oct 12, 2025 at 2:15 PM', amountUSD: 100.00, amountCrypto: 0.032, crypto: 'ETH', status: 'Completed', txHash: '0xdef...456' },
  { id: '3', type: 'Sent', to: 'Alice (alice@example.com)', date: 'Oct 11, 2025 at 6:45 PM', amountUSD: -25.50, amountCrypto: -0.008, crypto: 'ETH', status: 'Completed', txHash: '0xghi...789' },
  { id: '4', type: 'Bought', from: 'CryoPay Exchange', date: 'Oct 10, 2025 at 10:30 AM', amountUSD: 500.00, amountCrypto: 0.01157, crypto: 'BTC', status: 'Completed', txHash: '0xjkl...012' },
  { id: '5', type: 'Received', from: '0x789...abc', date: 'Oct 9, 2025 at 3:20 PM', amountUSD: 75.00, amountCrypto: 0.024, crypto: 'ETH', status: 'Completed', txHash: '0xmno...345' },
  { id: '6', type: 'Sent', to: 'Bob (bob@example.com)', date: 'Oct 8, 2025 at 1:15 PM', amountUSD: -30.00, amountCrypto: -0.0095, crypto: 'ETH', status: 'Pending', txHash: '0xpqr...678' },
  { id: '7', type: 'Sold', to: 'CryoPay Exchange', date: 'Oct 7, 2025 at 11:00 AM', amountUSD: 200.00, amountCrypto: -0.00462, crypto: 'BTC', status: 'Completed', txHash: '0xstu...901' },
  { id: '8', type: 'Received', from: '0xdef...234', date: 'Oct 6, 2025 at 4:50 PM', amountUSD: 150.00, amountCrypto: 0.048, crypto: 'ETH', status: 'Completed', txHash: '0xvwx...234' },
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = tx.to?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || tx.type.toLowerCase() === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    return ['Sent', 'Sold'].includes(type) ? 
      <ArrowUpRight className="h-5 w-5 text-red-500" /> : 
      <ArrowDownLeft className="h-5 w-5 text-green-500" />;
  };

  const handleExport = () => {
    alert('Exporting transactions to CSV...');
  };

  return (
    <DashboardLayout currentPage="transactions" title="Transactions">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="bought">Bought</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Filter className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No transactions found matching your filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>TX Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-slate-100 rounded-full">
                          {getTransactionIcon(tx.type)}
                        </span>
                        <span className="font-medium">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {tx.type === 'Sent' ? `To ${tx.to}` : 
                           tx.type === 'Received' ? `From ${tx.from}` : 
                           tx.type === 'Bought' ? `Bought from ${tx.from}` : 
                           `Sold to ${tx.to}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-500">{tx.date}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-medium ${tx.amountUSD > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                        {tx.amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </div>
                      <div className="text-sm text-slate-500">
                        {Math.abs(tx.amountCrypto)} {tx.crypto}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(tx.status)}`}>
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={`https://etherscan.io/tx/${tx.txHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {tx.txHash}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Transactions;