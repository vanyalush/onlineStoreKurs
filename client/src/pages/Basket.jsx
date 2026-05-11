import React, { useEffect, useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { fetchBasket, removeFromBasket } from "../http/basketApi";
import { Container, Card, Button, Row, Col, Image } from "react-bootstrap";

const Basket = observer(() => {
    const { basket } = useContext(Context);
    const BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5001';


    useEffect(() => {
        fetchBasket().then(data => basket.setItems(data));
    }, [basket]);

    const remove = (id) => {
        removeFromBasket(id).then(() => {
            basket.setItems(basket.items.filter(item => item.thingId !== id));
        });
    };

    if (basket.items.length === 0) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <h2 className="text-secondary">Корзина пуста</h2>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Корзина</h1>
            <Row>
                <Col md={8}>
                    {basket.items.map(item => (
                        <Card key={item.id} className="mb-3 p-3 shadow-sm">
                            <Row className="align-items-center">
                                <Col md={2}>
                                    <Image
                                        width={100}
                                        src={`${BASE_URL}/${item.thing.img}`}
                                        rounded
                                    />
                                </Col>
                                <Col md={5}>
                                    <h5>{item.thing.name}</h5>
                                    <div className="text-black-50">
                                        {item.thing.brand?.name || "Бренд не указан"}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <h5 className="text-primary">{item.thing.price} ₽</h5>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => remove(item.thingId)}
                                    >
                                        Удалить
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
                <Col md={4}>
                    <Card className="p-4 shadow-sm">
                        <h4>Детали заказа</h4>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                            <span>Товары ({basket.items.length}):</span>
                            <span>{basket.totalPrice} ₽</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <strong>Итого:</strong>
                            <strong className="text-primary" style={{ fontSize: '1.5rem' }}>
                                {basket.totalPrice} ₽
                            </strong>
                        </div>
                        <Button variant="success" size="lg" className="w-100">
                            Оформить заказ
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
});

export default Basket;