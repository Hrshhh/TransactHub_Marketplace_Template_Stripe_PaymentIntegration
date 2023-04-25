import React, { useState } from 'react';
import { Modal } from 'antd';
import "./BuyerPaymentModal.css";

const BuyerPaymentModal = ({session, orderedBy, showModal, setShowModal}) => {
    const [cancel, setCancel] = useState(false);
    const handleCancel = () => {
        setCancel(true);
    }
  return (
    <div>
        <Modal open={showModal} title="Order Payment info" onCancel={() => {setShowModal(!showModal)}}>
            <p>Customer: {orderedBy.name}</p>
            <p>Payment intent: {session.payment_intent}</p>
            <p>Payment status: {session.payment_status}</p>
            <p>Amount total: {session.currency.toUpperCase()}{" "}{session.amount_total /100}</p>
        </Modal>
    </div>
  )
}

export default BuyerPaymentModal