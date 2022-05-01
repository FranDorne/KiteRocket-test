import React, {useState, useEffect} from 'react';
import Select from 'react-select'
import './landing-page.css';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LandingPage() {

    const [ articles, setArticles ] = useState([]);
    const [ filteredArticles, setFilteredArticles ] = useState(articles);
    const [ filterTags, setFilterTags ] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const Products = async () => {
        const response = await axios
        .get(
            `${process.env.REACT_APP_KITE_API}`)
            .then((result) => { 
                return result.data;
            })
            setArticles(JSON.parse(JSON.stringify(response)));
            setFilteredArticles(JSON.parse(JSON.stringify(response)));
            console.log(filteredArticles);
    }

    const Filter = (e) => {
        e.preventDefault()
        if(filterTags.length === 0 ) return
        const noTags = articles.filter(item => item._embedded["wp:term"][1].length > 0)
        const filteredResults = noTags.filter(item => {
            const nameTags = item._embedded["wp:term"][1].map(({name}) => name)
            return filterTags.some(tag => nameTags.includes(tag))
        })
        setFilteredArticles(filteredResults)
    } 

    const clearFilter = () => {
        setFilteredArticles(articles);
    }

    const options = [
        { value: 'Sustainability', label:'Sustainability'},
        { value: 'chip', label:'Chip'},
        { value: 'China', label:'China'},
        { value: 'Shanghai', label:'Shanghai'}
    ]

    const getValues = (selectedValues) => {
        const values = selectedValues.map(item => item.value)
        setFilterTags(values);
    }

    useEffect(() => {
        Products();
    },[]) 
    
  return (
    <div className='landingPageContainer'>
        <div className='landingPageBrand'>
            <img className='imgBrand' src='KiteRocket.png' alt=''/>
        </div>
        <div className='products'>
        </div>
        <container>
            <div>
                <Select className='filterSelect' options={options} isMulti={true} onChange={getValues}></Select>
                <button className='filterButton' onClick={(e) => Filter(e)}>
                    Filtrar
                </button>
                <button className='clearFilterButton' onClick={() => clearFilter()}>
                    Limpiar filtros
                </button>
            </div>
            <h1 className='pageTittle'>Kite Rocket Articles</h1>
            <ul className='ulGrid'>
            {
                filteredArticles.length > 0 && (
                filteredArticles.map((item) => {
                    console.log(filteredArticles)
                        return(
                            <div className='liDiv'>
                                <li>
                                    <img className='listedProductImg' src={item.yoast_head_json.og_image[0].url} alt='product'/>
                                    <h3 className='productName'>{item.yoast_head_json.og_title}</h3>
                                    <p className='productDescription' dangerouslySetInnerHTML={{__html: item.excerpt.rendered}} />
                                    {item._embedded["wp:term"][1].length > 0 &&
                                    <div className='tagDiv'>
                                        <p className='productTag'>
                                            <span className='tagSpan'>Tags: </span>{item._embedded["wp:term"][1].map((tag) => {
                                                return `${tag.name}, `
                                            })}
                                        </p>
                                    </div>
                                    }
                                    <button onClick={handleShow}  className='readMore'>
                                        Read more
                                    </button>
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Nombre del articulo</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Descripcion completa del articulo</Modal.Body>
                                        <Modal.Footer>
                                            <Button className='InfoButton' variant="secondary">
                                            <a href={item.link} className='InfoButtonLink'>
                                                INFO
                                            </a>
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </li>
                            </div>
                                )
                }))
            }
            </ul>
        </container>
        <footer className='landingPageFooter'>
            KiteRocket Landing Page.
        </footer>
    </div>
  );
}
