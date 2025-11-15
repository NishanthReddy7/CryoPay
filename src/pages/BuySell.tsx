import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Info, TrendingUp, TrendingDown } from "lucide-react";
import DashboardLayout from '../components/DashboardLayout';

const currencies = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
  { code: 'USDT', name: 'Tether', symbol: 'USDT', rate: 1 },
];

const cryptocurrencies = [
  { code: 'BTC', name: 'Bitcoin', price: 43250.00, change: 2.5 },
  { code: 'ETH', name: 'Ethereum', price: 2280.50, change: 1.8 },
  { code: 'BNB', name: 'Binance Coin', price: 312.75, change: -0.5 },
  { code: 'SOL', name: 'Solana', price: 98.20, change: 3.2 },
  { code: 'ADA', name: 'Cardano', price: 0.52, change: -1.1 },
];

const BuySell = () => {
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [buyCurrency, setBuyCurrency] = useState('USD');
  const [sellCurrency, setSellCurrency] = useState('USD');
  const [buyCrypto, setBuyCrypto] = useState('BTC');
  const [sellCrypto, setSellCrypto] = useState('BTC');

  const selectedBuyCurrency = currencies.find(c => c.code === buyCurrency);
  const selectedSellCurrency = currencies.find(c => c.code === sellCurrency);
  const selectedBuyCrypto = cryptocurrencies.find(c => c.code === buyCrypto);
  const selectedSellCrypto = cryptocurrencies.find(c => c.code === sellCrypto);

  const calculateBuyCrypto = () => {
    if (!buyAmount || !selectedBuyCrypto || !selectedBuyCurrency) return '0.00000000';
    const usdAmount = parseFloat(buyAmount) / selectedBuyCurrency.rate;
    const cryptoAmount = usdAmount / selectedBuyCrypto.price;
    return cryptoAmount.toFixed(8);
  };

  const calculateSellFiat = () => {
    if (!sellAmount || !selectedSellCrypto || !selectedSellCurrency) return '0.00';
    const usdAmount = parseFloat(sellAmount) * selectedSellCrypto.price;
    const fiatAmount = usdAmount * selectedSellCurrency.rate;
    return fiatAmount.toFixed(2);
  };

  const handleBuy = () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    alert(`Buy order placed!\n${calculateBuyCrypto()} ${buyCrypto} for ${selectedBuyCurrency?.symbol}${buyAmount}`);
  };

  const handleSell = () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    alert(`Sell order placed!\n${sellAmount} ${sellCrypto} for ${selectedSellCurrency?.symbol}${calculateSellFiat()}`);
  };

  return (
    <DashboardLayout currentPage="buy-sell" title="Buy/Sell Crypto">
      <div className="space-y-6">
        {/* Market Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {cryptocurrencies.map((crypto) => (
                <div key={crypto.code} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{crypto.code}</span>
                    <span className={`flex items-center text-sm ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {crypto.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(crypto.change)}%
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">{crypto.name}</div>
                  <div className="text-lg font-bold mt-1">${crypto.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buy/Sell Tabs */}
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy Crypto</TabsTrigger>
            <TabsTrigger value="sell">Sell Crypto</TabsTrigger>
          </TabsList>

          {/* BUY TAB */}
          <TabsContent value="buy">
            <Card>
              <CardHeader>
                <CardTitle>Buy Cryptocurrency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Input */}
                  <div className="space-y-4">
                    <div>
                      <Label>I want to spend</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={buyCurrency} onValueChange={setBuyCurrency}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedBuyCurrency?.name} ({selectedBuyCurrency?.symbol})
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-slate-400" />
                    </div>

                    <div>
                      <Label>I will receive</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="text"
                          value={calculateBuyCrypto()}
                          readOnly
                          className="flex-1 bg-slate-50"
                        />
                        <Select value={buyCrypto} onValueChange={setBuyCrypto}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cryptocurrencies.map((crypto) => (
                              <SelectItem key={crypto.code} value={crypto.code}>
                                {crypto.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedBuyCrypto?.name}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Summary */}
                  <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Current Price:</span>
                        <span className="font-medium">${selectedBuyCrypto?.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Amount:</span>
                        <span className="font-medium">{selectedBuyCurrency?.symbol}{buyAmount || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Network Fee:</span>
                        <span className="font-medium">$2.50</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold">
                        <span>You'll receive:</span>
                        <span>{calculateBuyCrypto()} {buyCrypto}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mt-4">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-900">
                        Your crypto will be deposited to your CryoPay wallet instantly after payment confirmation.
                      </p>
                    </div>

                    <Button onClick={handleBuy} className="w-full mt-4">
                      Buy {buyCrypto}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SELL TAB */}
          <TabsContent value="sell">
            <Card>
              <CardHeader>
                <CardTitle>Sell Cryptocurrency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Input */}
                  <div className="space-y-4">
                    <div>
                      <Label>I want to sell</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          placeholder="0.00000000"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={sellCrypto} onValueChange={setSellCrypto}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cryptocurrencies.map((crypto) => (
                              <SelectItem key={crypto.code} value={crypto.code}>
                                {crypto.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Available: 0.05420000 {sellCrypto}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-slate-400" />
                    </div>

                    <div>
                      <Label>I will receive</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="text"
                          value={calculateSellFiat()}
                          readOnly
                          className="flex-1 bg-slate-50"
                        />
                        <Select value={sellCurrency} onValueChange={setSellCurrency}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedSellCurrency?.name} ({selectedSellCurrency?.symbol})
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Summary */}
                  <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Current Price:</span>
                        <span className="font-medium">${selectedSellCrypto?.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Amount:</span>
                        <span className="font-medium">{sellAmount || '0.00000000'} {sellCrypto}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Network Fee:</span>
                        <span className="font-medium">$1.50</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold">
                        <span>You'll receive:</span>
                        <span>{selectedSellCurrency?.symbol}{calculateSellFiat()}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg mt-4">
                      <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-orange-900">
                        <strong>Important:</strong> To prevent exploitation, all sell orders are manually reviewed. Funds will be credited to your account within 24-48 hours after verification. Daily sell limit: $10,000.
                      </p>
                    </div>

                    <Button onClick={handleSell} className="w-full mt-4">
                      Sell {sellCrypto}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BuySell;