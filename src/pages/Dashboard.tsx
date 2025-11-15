import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutGrid, ArrowRightLeft, Users, Settings, LogOut, Bell, Search, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownLeft, Copy, PanelLeftClose, PanelRightClose } from "lucide-react";

const CryoPayLogo = ({ isExpanded }) => (
  <div className="text-2xl font-bold tracking-tighter px-4 whitespace-nowrap">
    {isExpanded ? <>Cryo<span className="text-slate-500">Pay</span></> : <>C<span className="text-slate-500">P</span></>}
  </div>
);

const Sidebar = ({ isExpanded, isPinned, onTogglePin, onMouseEnter, onMouseLeave }) => (
  <aside 
    className={`fixed top-0 left-0 h-full bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-50 ${isExpanded || isPinned ? 'w-64' : 'w-20'}`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="h-16 flex items-center border-b border-slate-200">
      <CryoPayLogo isExpanded={isExpanded || isPinned} />
    </div>
    <nav className="flex-1 px-2 py-4 space-y-2">
      <a href="#" className="flex items-center px-4 py-2 text-sm font-medium bg-slate-200 text-slate-900 rounded-lg"><LayoutGrid className="h-5 w-5 flex-shrink-0" />{(isExpanded || isPinned) && <span className="ml-3">Dashboard</span>}</a>
      <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"><ArrowRightLeft className="h-5 w-5 flex-shrink-0" />{(isExpanded || isPinned) && <span className="ml-3">Transactions</span>}</a>
      <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"><Users className="h-5 w-5 flex-shrink-0" />{(isExpanded || isPinned) && <span className="ml-3">Contacts</span>}</a>
      <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"><Settings className="h-5 w-5 flex-shrink-0" />{(isExpanded || isPinned) && <span className="ml-3">Settings</span>}</a>
    </nav>
    <div className="px-2 py-4 border-t border-slate-200">
      {/* UPDATE: Pin button added */}
      <Button variant="ghost" onClick={onTogglePin} className="w-full justify-start px-4 text-slate-600 mb-2">
        {isPinned ? <PanelLeftClose className="h-5 w-5 flex-shrink-0" /> : <PanelRightClose className="h-5 w-5 flex-shrink-0" />}
        {(isExpanded || isPinned) && <span className="ml-3">{isPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}</span>}
      </Button>
      <Button variant="ghost" className="w-full justify-start px-4 text-slate-600"><LogOut className="h-5 w-5 flex-shrink-0" />{(isExpanded || isPinned) && <span className="ml-3">Log Out</span>}</Button>
    </div>
  </aside>
);

const transactions = [ { type: 'Sent', to: 'E-Shop', date: 'Oct 13, 2025 at 8:30 PM', amountUSD: -50.00, amountETH: -0.016, status: 'Completed' }, { type: 'Received', from: '0x123...456', date: 'Oct 12, 2025 at 2:15 PM', amountUSD: 100.00, amountETH: 0.032, status: 'Completed' }];

const Dashboard = () => {
  // UPDATE: New state for pinning the sidebar
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const isNonCustodial = true;

  const handleTogglePin = () => setIsSidebarPinned(!isSidebarPinned);
  const handleMouseEnter = () => !isSidebarPinned && setIsSidebarExpanded(true);
  const handleMouseLeave = () => !isSidebarPinned && setIsSidebarExpanded(false);

  const getStatusClass = (status) => (status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800');
  const getTransactionIcon = (type) => (type === 'Sent' ? <ArrowUpRight className="h-5 w-5 text-red-500" /> : <ArrowDownLeft className="h-5 w-5 text-green-500" />);

  return (
    <div className="flex bg-white text-slate-800">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        isPinned={isSidebarPinned}
        onTogglePin={handleTogglePin}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      />
      <main className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${isSidebarExpanded || isSidebarPinned ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 flex items-center justify-between border-b border-slate-200 px-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><Input placeholder="Search..." className="pl-10 w-64" /></div>
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader><CardTitle className="text-sm font-medium text-slate-500">CURRENT BALANCE</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold">$1,234.56</p><p className="text-slate-500">~ 0.41 ETH</p>{isNonCustodial && (<div className="flex items-center text-sm text-slate-500 mt-2"><span>Connected: 0xAbC...dEf</span><button className="ml-2 hover:text-slate-800"><Copy className="h-4 w-4" /></button></div>)}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium text-slate-500">QUICK ACTIONS</CardTitle></CardHeader>
              <CardContent className="flex gap-4"><Button className="w-full"><ArrowUp className="mr-2 h-4 w-4" /> Send</Button><Button variant="secondary" className="w-full"><ArrowDown className="mr-2 h-4 w-4" /> Receive</Button></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Recent Activity</CardTitle><a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">View All</a></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Details</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-center">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {transactions.map((tx, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="flex items-center gap-3"><span className="p-2 bg-slate-100 rounded-full">{getTransactionIcon(tx.type)}</span><div><div className="font-medium">{tx.type === 'Sent' ? `To ${tx.to}` : `From ${tx.from}`}</div><div className="text-sm text-slate-500">{tx.date}</div></div></div></TableCell>
                      <TableCell className="text-right"><div className={`font-medium ${tx.amountUSD > 0 ? 'text-green-600' : 'text-slate-800'}`}>{tx.amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div><div className="text-sm text-slate-500">~ {Math.abs(tx.amountETH)} ETH</div></TableCell>
                      <TableCell className="text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(tx.status)}`}>{tx.status}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

