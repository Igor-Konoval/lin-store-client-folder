import React, {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
import {IAdminModal} from "../../models/IAdminModal";
import {Button, Card, Col, Form, Image, Modal, Row} from "react-bootstrap";
import {UseAppDispatch, UseAppSelector} from "../../hooks/redux";
import {fetchBrand, fetchFilter} from "../../store/reducers/ProductsActionCreator";
import {createProduct} from "../../http/createProduct";
import {IColors, IDescription} from "../../models/IDescription";
import "../../moduleCSS/Product.css"
import "../../moduleCSS/CreateProduct.css"
import AlertDismissible from "../AlertDismissible";
import {IErrorMessage} from "../../models/ISelectedDevice";

const CreateProduct:FC<IAdminModal> = ({show, onHide}) => {

    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [file, setFile] = useState<null | File>(null)
    const [nameProduct, setNameProduct] = useState<string>('');
    const [wasInUsed, setWasInUsed] = useState<boolean>(false);
    const [price, setPrice] = useState<number>();
    const [description, setDescription] = useState<IDescription[]>([]);
    const [colors, setColors] = useState<IColors[]>([]);
    const [imgGallery, setImgGallery] = useState<File[]>([]);
    const [shortDescription, setShortDescription] = useState<string>('')
    const [showAlertDis, setShowAlertDis] = useState(false);
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>({errorTitle: "", errorData: ""})
    const [fetching, setFetching] = useState<boolean>(false);

    const cardMainImg = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => {
        return () => {
            if (file) {
                URL.revokeObjectURL(cardMainImg as string);
            }
        };
    }, [cardMainImg, file]);

    // const addDescription = () => {
    //     setDescription([...description, {title: '', description: '', number: +Date.now()}]);
    // }

    const addDescription = () => {
        if (description.length === 0) {
            setDescription([
                {
                    title: 'Категория',
                    description: types.find(type => type._id === selectedType) ? types.find(type => type._id === selectedType).name : "",
                    number: +Date.now(),
                },
                {
                    title: 'Бренд',
                    description: brands.find(brand => brand._id === selectedBrand) ? brands.find(brand => brand._id === selectedBrand).name : "",
                    number: +Date.now() + 1,
                },
            ]);
        } else if (description.length === 1) {
            setDescription([...description,
                {
                    title: 'Бренд',
                    description: brands.find(brand => brand._id === selectedBrand) ? brands.find(brand => brand._id === selectedBrand).name : "",
                    number: +Date.now(),
                },
            ]);
        } else {
            setDescription([...description, { title: '', description: '', number: +Date.now() }]);
        }
    };


    const removeDescription = (number: number) => {
        setDescription(description.filter(value => value.number !== number));
    }

    const changeDescription = (key: string, info: string, number: number) => {
        setDescription(description.map(value => value.number === number ? {...value, [key]: info} : value))
    }

    const addColor = () => {
        const newColor = { color: '', count: 0, urlImg: null, number: +Date.now() };

        if (file && colors.length === 0) {
            newColor.urlImg = file;
        }
        setColors([...colors, newColor]);
    };


    const addColorCount = (colorCount: number, number: number) => {
        setColors(colors.map(value => value.number === number ? {...value, count: +colorCount} : value))
    }

    const removeColor = (number: number) => {
        setColors(colors.filter(value => value.number !== number));
    }

    const changeColor = (key: string, info: File | string, number: number) => {
        setColors(colors.map(value => value.number === number ? {...value, [key]: info} : value))
    }

    const selectFileForColor = (e: React.ChangeEvent<HTMLInputElement>, number: number) => {
        const file = e.target.files[0];
        changeColor('urlImg', file, number);
    };

    const generateUniqueId = (): string=> {
        const random = Math.floor(Math.random() * 9000000) + 1000000;

        return random.toString().substring(0, 12);
    }

    const dispatch = UseAppDispatch();
    const brands = UseAppSelector(state => state.BrandsFilterSlice.filters);
    const types = UseAppSelector(state => state.TypesFilterSlice.filters);

    useEffect(()=> {
        if (!brands.length) dispatch(fetchBrand('brand'));
        if (!types.length) dispatch(fetchFilter('type'));

    }, [])

    const changeTypeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id: string = types.find(type => type.name === e.target.value)._id;
        setSelectedType(id);
    };

    const changeBrandHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id: string = brands.find(brand => brand.name === e.target.value)._id;
        setSelectedBrand(id);
    };

    const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files[0])
    }

    const addProduct = async () => {
        if (fetching) {
            return false
        }
        setFetching(true);

        try {
            const formData = new FormData()
            formData.append('name', nameProduct + " (" + generateUniqueId() + ")")
            formData.append('price', price)
            const blobFile = file.slice(0, file.size, "image/jpeg")
            const newFile = new File([blobFile], "img", {type: "image/jpeg"});
            formData.append(`img`, newFile);

            imgGallery.forEach((image, index) => {
                formData.append(`imgGallery[${index}]`, image);
            });

            formData.append('wasInUsed', wasInUsed)
            formData.append('brandId', selectedBrand)
            formData.append('typeId', selectedType)
            formData.append('description', JSON.stringify(description))
            formData.append("shortDescription", shortDescription);
            colors.forEach((colorProduct, index) => {
                formData.append(`colors`, JSON.stringify({index, color: colorProduct.color, count: colorProduct.count}));

                if (colorProduct.urlImg instanceof File) {
                    formData.append(`colors[${index}][urlImg]`, colorProduct.urlImg);
                }
            });

            await createProduct(formData).then(data => {
                setWasInUsed(false);
                setColors([])
                onHide()
            })
        } catch (e) {
            setErrorMessage({
                errorTitle: "Ошибка",
                errorData: `Произошла ошибка создания ${e.response.data.message}`
            });
            setShowAlertDis(true);
        } finally {
            setFetching(false)
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Создать продукт
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название продукта</Form.Label>
                            <Form.Control value={nameProduct} onChange={(e) => setNameProduct(e.target.value)}
                                          placeholder="название продукта"></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Короткая информация товара</Form.Label>
                            <Form.Control
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="короткая информация"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Указать цену</Form.Label>
                            <Form.Control type="number" onChange={(e) => setPrice(+e.target.value)} placeholder="цена"></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Указать что товар б/у</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={wasInUsed}
                                title="товар б/у"
                                onChange={(e) => {
                                    setWasInUsed(e.target.checked);
                                }}></Form.Check>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Указать тип продукта</Form.Label>
                            <Form.Select onChange={(e) => changeTypeHandler(e)}>
                                <option>Выбрать тип</option>
                                {types.map(type => <option key={type._id}>{type.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Указать брэнд продукта</Form.Label>
                            <Form.Select onChange={(e) => changeBrandHandler(e)}>
                                <option>Выбрать брэнд</option>
                                {brands.map(brand => <option key={brand._id}>{brand.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <hr/>
                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>Добавить главное изображение</Form.Label>
                            <Form.Control type="file" onChange={selectFile}/>
                        </Form.Group>
                        <hr/>
                        <Button variant="outline-dark" onClick={addColor}>Добавить цвет товара и количество</Button>
                        {colors.map((i, index) =>
                            <Row key={i.number} className="container-inputs">
                                <Col xs={4} sm={4}>
                                    <Form.Group controlId="formFileMultiple">
                                        {index === 0 ? <Form.Label>Цвет (как главное изображение)</Form.Label> :
                                            <Form.Label>Цвет</Form.Label>}
                                        <Form.Control
                                            placeholder="Цвет" value={i.color}
                                            onChange={(e) => changeColor('color', e.target.value, i.number)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm={3}>
                                    <Form.Group controlId="formFileMultiple">
                                        <Form.Label>Количество</Form.Label>
                                        <Form.Control
                                            onChange={(e) => addColorCount(+e.target.value, i.number)}
                                            placeholder="количество"
                                            type="number"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm={3}>
                                    <Form.Group controlId="formFileMultiple">
                                        <Form.Label>Изображение</Form.Label>
                                        <Form.Control type="file" onChange={(e) => selectFileForColor(e, i.number)}/>
                                    </Form.Group>
                                </Col>
                                <Col xs={2} sm={1} className="mt-auto p-0">
                                    <Button variant="outline-dark" size={"sm"} onClick={() => removeColor(i.number)}>
                                        <Image src={process.env.REACT_APP_API_URL + "icons8-close-24.png"}/>
                                    </Button>
                                </Col>
                            </Row>
                        )}
                        <hr/>

                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>Добавить галерею изображений</Form.Label>
                            <Form.Control type="file" multiple onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setImgGallery(Array.from(e.target.files));
                            }}/>
                        </Form.Group>
                        <hr/>
                        <Button variant="outline-dark" onClick={addDescription}>Добавить описание и
                            характеристики</Button>
                        {description.map((i, index) =>
                            <Row key={i.number} className="mt-3 d-flex flex-nowrap container-inputs">
                                {index === 0 ?
                                    <>
                                        <Col xs={5} sm={5}>
                                            <Form.Group controlId="formFileMultiple" className="mb-3">
                                                <Form.Control
                                                    placeholder="Ввести заголовок"
                                                    value={i.title}
                                                    onChange={(e) => changeDescription('title', e.target.value, i.number)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={5} sm={5}>
                                            <Form.Group controlId="formFileMultiple" className="mb-3">
                                                <Form.Control
                                                    placeholder="Ввести описание"
                                                    value={i.description}
                                                    onChange={(e) => changeDescription('description', e.target.value, i.number)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2} sm={2} className="p-0">
                                            <Button variant="outline-dark" onClick={() => removeDescription(i.number)}>
                                                <Image src={process.env.REACT_APP_API_URL + "icons8-close-24.png"}/>
                                            </Button>
                                        </Col>
                                    </> : index === 1 ?
                                        <>
                                            <Col xs={5} sm={5}>
                                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                                    <Form.Control placeholder="Ввести заголовок" value={i.title}
                                                                  onChange={(e) => changeDescription('title', e.target.value, i.number)}/>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={5} sm={5}>
                                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                                    <Form.Control placeholder="Ввести описание"
                                                                  value={i.description}
                                                                  onChange={(e) => changeDescription('description', e.target.value, i.number)}/>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={1} sm={1} className="p-0">
                                                <Button variant="outline-dark"
                                                        onClick={() => removeDescription(i.number)}>
                                                    <Image src={process.env.REACT_APP_API_URL + "icons8-close-24.png"}/>
                                                </Button>
                                            </Col>
                                        </> :
                                        <>
                                            <Col xs={5} sm={5}>
                                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                                    <Form.Control placeholder="Ввести заголовок" value={i.title}
                                                                  onChange={(e) => changeDescription('title', e.target.value, i.number)}/>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={5} sm={5}>
                                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                                    <Form.Control placeholder="Ввести описание" value={i.description}
                                                                  onChange={(e) => changeDescription('description', e.target.value, i.number)}/>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={2} sm={1} className="p-0">
                                                <Button variant="outline-dark"
                                                        onClick={() => removeDescription(i.number)}>
                                                    <Image src={process.env.REACT_APP_API_URL + "icons8-close-24.png"}/>
                                                </Button>
                                            </Col>
                                        </>
                                }
                            </Row>
                        )}
                    </Form>
                    <div className="my-2">
                        <p>Примерный вид товара</p>
                    </div>
                    <Card
                        className="card-product"
                    >
                        {file &&
                            <Card.Img
                                className={`card-img-product`}
                                src={cardMainImg}>
                            </Card.Img>
                        }
                        <Card.Body className="card-body-product">
                            <Row
                                className="d-flex justify-content-between align-content-center my-1 card-body-product-centered"
                            >
                                <Col sm={8} xs={12}>{nameProduct}</Col>
                                <Col sm={4} xs={12} className="text-end default-product-price">{`${price} грн.`}</Col>
                            </Row>
                            <Row>
                                <Col
                                    className="text-muted card-product-shortDesc"
                                >
                                    {shortDescription}
                                </Col>
                            </Row>
                            <Row className="d-flex align-items-center">
                                <Col className="d-flex my-1">
                                    {"рейтинг"}
                                    <span className="text-muted ms-1">{`(${0})`}</span>
                                </Col>
                                <Col xl={5} xs={12} className="text-muted fw-semibold fs-6">{`продаж ${0}`}</Col>
                            </Row>
                            <Row>
                                <Col sm={4} xs={12}
                                     className="text-end small-screen-product-price">{`${price} грн.`}</Col>
                                <Col className="d-flex justify-content-end">
                                    <Button
                                        variant="outline-dark"
                                        size="lg"
                                        className="d-flex align-items-center button-add-basket"
                                    > в корзину
                                        <Image
                                            className="ms-2"
                                            width={25}
                                            height={25}
                                            src={process.env.REACT_APP_API_URL + 'add-to-basket.png'}
                                        />
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide}>Закрыть</Button>
                    <Button onClick={addProduct}>{ fetching ? "идет отправка" : "Добавить продукт" }</Button>
                </Modal.Footer>
            </Modal>
            <article>
                <AlertDismissible
                    showAlertDis={showAlertDis}
                    errorMessage={errorMessage}
                    setShowAlertDis={() => setShowAlertDis(false)}
                />
            </article>
        </>
    );
};

export default CreateProduct;