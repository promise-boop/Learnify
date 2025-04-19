import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../api/supabase';
import { PayPalButtons } from '@paypal/react-paypal-js';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #32325d;
  margin: 0 0 10px;
`;

const Description = styled.p`
  color: #525f7f;
  margin: 0;
`;

const CreditsSummary = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const CreditCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1;
`;

const CreditValue = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #5e72e4;
  margin-bottom: 10px;
`;

const CreditLabel = styled.div`
  font-size: 14px;
  color: #8898aa;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #32325d;
  margin: 30px 0 15px;
`;

const PackagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const PackageCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: ${props => props.selected ? '2px solid #5e72e4' : '1px solid #e9ecef'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PackageName = styled.h3`
  font-size: 18px;
  color: #32325d;
  margin: 0 0 10px;
`;

const PackagePrice = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #5e72e4;
  margin-bottom: 10px;
`;

const PackageCredits = styled.div`
  font-size: 16px;
  color: #525f7f;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  background-color: ${props => props.primary ? '#5e72e4' : 'white'};
  color: ${props => props.primary ? 'white' : '#5e72e4'};
  border: 1px solid ${props => props.primary ? 'transparent' : '#5e72e4'};
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#4c5ce1' : '#edf2f7'};
  }
`;

const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  color: #8898aa;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 12px;
  color: #525f7f;
`;

const PaymentModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PaymentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: #8898aa;
`;

const Credits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  const creditPackages = [
    { id: 1, name: '50 Credits', credits: 50, price: 5.99, unlimited: false },
    { id: 2, name: '200 Credits', credits: 200, price: 15.99, unlimited: false },
    { id: 3, name: '500 Credits', credits: 500, price: 39.99, unlimited: false },
    { id: 4, name: 'Unlimited (30 days)', credits: Infinity, price: 25.99, unlimited: true }
  ];

  useEffect(() => {
    if (!user) return;

    const fetchCreditData = async () => {
      try {
        // Get current credits
        const { data: creditsData } = await supabase
          .from('credits')
          .select('amount, is_unlimited, expiry_date')
          .eq('user_id', user.id)
          .gt('expiry_date', new Date().toISOString());
        
        // Calculate total available credits
        let totalCredits = 0;
        let hasUnlimited = false;
        
        if (creditsData) {
          creditsData.forEach(credit => {
            if (credit.is_unlimited) {
              hasUnlimited = true;
            } else {
              totalCredits += credit.amount;
            }
          });
        }
        
        setCredits(hasUnlimited ? 'Unlimited' : totalCredits);
        
        // Get transaction history
        const { data: transactionsData } = await supabase
          .from('credits')
          .select('*')
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });
        
        setTransactions(transactionsData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching credit data:', error);
        setLoading(false);
      }
    };

    fetchCreditData();
  }, [user]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (details) => {
    try {
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(now.getDate() + 30); // 30 days from now
      
      // Record transaction
      await supabase.from('credits').insert({
        user_id: user.id,
        amount: selectedPackage.unlimited ? 0 : selectedPackage.credits,
        transaction_type: 'purchase',
        purchase_id: details.id,
        purchase_date: now.toISOString(),
        expiry_date: expiryDate.toISOString(),
        is_unlimited: selectedPackage.unlimited
      });
      
      // Update local state
      setCredits(prev => 
        selectedPackage.unlimited ? 'Unlimited' : 
        (prev === 'Unlimited' ? prev : prev + selectedPackage.credits)
      );
      
      // Refresh transactions
      const { data } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });
      
      setTransactions(data || []);
      setShowPayment(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error recording transaction:', error);
    }
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setSelectedPackage(null);
  };

  if (loading) {
    return <div>Loading credits information...</div>;
  }

  return (
    <PageContainer>
      <Header>
        <Title>Credits</Title>
        <Description>
          Purchase and manage your Learnify credits for AI-powered learning features.
        </Description>
      </Header>
      
      <CreditsSummary>
        <CreditCard>
          <CreditValue>{credits}</CreditValue>
          <CreditLabel>Available Credits</CreditLabel>
        </CreditCard>
      </CreditsSummary>
      
      <SectionTitle>Buy Credits</SectionTitle>
      <PackagesGrid>
        {creditPackages.map(pkg => (
          <PackageCard 
            key={pkg.id}
            selected={selectedPackage?.id === pkg.id}
          >
            <PackageName>{pkg.name}</PackageName>
            <PackagePrice>${pkg.price}</PackagePrice>
            <PackageCredits>
              {pkg.unlimited ? 'Unlimited usage for 30 days' : `${pkg.credits} credits`}
            </PackageCredits>
            <Button 
              primary
              onClick={() => handlePackageSelect(pkg)}
            >
              Purchase
            </Button>
          </PackageCard>
        ))}
      </PackagesGrid>
      
      <SectionTitle>Transaction History</SectionTitle>
      <TransactionsTable>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Expiry</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {transactions.map(transaction => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.purchase_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {transaction.is_unlimited ? 'Unlimited Plan' : 'Credit Purchase'}
              </TableCell>
              <TableCell>
                {transaction.is_unlimited ? 'Unlimited' : `${transaction.amount} credits`}
              </TableCell>
              <TableCell>
                {new Date(transaction.expiry_date).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <EmptyState>No transaction history available</EmptyState>
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </TransactionsTable>
      
      {showPayment && (
        <PaymentModal>
          <PaymentCard>
            <CloseButton onClick={handleClosePayment}>&times;</CloseButton>
            <h2>Complete Purchase</h2>
            <p>
              {selectedPackage?.unlimited 
                ? 'Unlimited credits for 30 days' 
                : `${selectedPackage?.credits} credits`
              }
            </p>
            <h3>${selectedPackage?.price}</h3>
            
            <div style={{ marginTop: '20px' }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: selectedPackage?.price.toString()
                      },
                      description: selectedPackage?.unlimited 
                        ? 'Learnify Unlimited Credits (30 days)' 
                        : `Learnify ${selectedPackage?.credits} Credits`
                    }]
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then(details => {
                    handlePaymentSuccess(details);
                  });
                }}
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay'
                }}
              />
            </div>
          </PaymentCard>
        </PaymentModal>
      )}
    </PageContainer>
  );
};

export default Credits;