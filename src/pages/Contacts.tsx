import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Send, Edit, Trash2, UserCircle } from "lucide-react";
import DashboardLayout from '../components/DashboardLayout';

interface Contact {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  lastTransaction?: string;
}

const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', walletAddress: '0xABC...123', lastTransaction: 'Oct 13, 2025' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', walletAddress: '0xDEF...456', lastTransaction: 'Oct 8, 2025' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', walletAddress: '0xGHI...789', lastTransaction: 'Never' },
];

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', walletAddress: '' });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (!formData.name || !formData.email || !formData.walletAddress) {
      alert('Please fill all fields');
      return;
    }
    const newContact: Contact = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      walletAddress: formData.walletAddress,
      lastTransaction: 'Never'
    };
    setContacts([...contacts, newContact]);
    setFormData({ name: '', email: '', walletAddress: '' });
    setIsAddModalOpen(false);
  };

  const handleEditContact = () => {
    if (!formData.name || !formData.email || !formData.walletAddress || !currentContact) {
      alert('Please fill all fields');
      return;
    }
    setContacts(contacts.map(c => 
      c.id === currentContact.id 
        ? { ...c, name: formData.name, email: formData.email, walletAddress: formData.walletAddress }
        : c
    ));
    setFormData({ name: '', email: '', walletAddress: '' });
    setCurrentContact(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const openEditModal = (contact: Contact) => {
    setCurrentContact(contact);
    setFormData({ name: contact.name, email: contact.email, walletAddress: contact.walletAddress });
    setIsEditModalOpen(true);
  };

  const handleSendMoney = (contact: Contact) => {
    alert(`Send money to ${contact.name} (${contact.walletAddress})`);
  };

  return (
    <DashboardLayout currentPage="contacts" title="Contacts">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>My Contacts</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <UserCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="mb-2">No contacts found</p>
              <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-lg">
                        {contact.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-slate-500">{contact.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">Wallet Address</p>
                    <p className="text-sm font-mono bg-slate-50 p-2 rounded">{contact.walletAddress}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-slate-500">Last Transaction: <span className="text-slate-700">{contact.lastTransaction}</span></p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={() => handleSendMoney(contact)} size="sm" className="flex-1">
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                    <Button onClick={() => openEditModal(contact)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDeleteContact(contact.id)} variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>Add a new contact to your address book</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="add-wallet">Wallet Address</Label>
              <Input
                id="add-wallet"
                placeholder="0x..."
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-wallet">Wallet Address</Label>
              <Input
                id="edit-wallet"
                placeholder="0x..."
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Contacts;