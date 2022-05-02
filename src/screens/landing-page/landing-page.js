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
    const [ loading, setLoading ] = useState(true)
    const [ selectedArticle, setSelectedArticle ] = useState({})
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (selected) => {setShow(true); setSelectedArticle(selected)};


    const Products = async () => {
        const response = await axios
        .get(
            `${process.env.REACT_APP_KITE_API}`)
            .then((result) => { 
                return result.data;
            })
            setArticles(JSON.parse(JSON.stringify(response)));
            setFilteredArticles(JSON.parse(JSON.stringify(response)));
            setLoading(false);
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
    <>
        {loading ? (
            <p>Cargando</p>
        ) : (
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
                            return(
                                <div className='liDiv'>
                                    <li>
                                        <img className='listedProductImg' src={item.yoast_head_json.og_image[0].url} alt='product'/>
                                        <h3 className='productName'>
                                        {
                                        (item.yoast_head_json.og_title.length > 45
                                            ? item.yoast_head_json.og_title.substring(0, 45) + "..."
                                            : item.yoast_head_json.og_title)
                                        }
                                        </h3>
                                        <p className='productDescription' dangerouslySetInnerHTML= {{__html: 
                                            (item.excerpt.rendered.length > 100
                                                ? item.excerpt.rendered.substring(0, 100) + "..."
                                                : item.excerpt.rendered)
                                        }}>
                                        
                                        </p>
                                        {item._embedded["wp:term"][1].length > 0 &&
                                        <div className='tagDiv'>
                                            <p className='productTag'>
                                                <span className='tagSpan'>Tags: </span>{item._embedded["wp:term"][1].map((tag) => {
                                                    return `${tag.name}, `
                                                })}
                                            </p>
                                        </div>
                                        }
                                        <button onClick={() => handleShow(item)}  className='readMore'>
                                            Read more
                                        </button>
                                        <Modal show={show} onHide={handleClose} animation={true} centered={true} size={'xl'} backdrop={false} className='Modal'>
                                            <Modal.Header closeButton>
                                            </Modal.Header>
                                            <Modal.Body>
                                            <img className='listedProductImg' src={selectedArticle.yoast_head_json ? selectedArticle.yoast_head_json.og_image[0].url : "photo" } alt='product'/>
                                                <Modal.Title className='modalTittle' >{selectedArticle.yoast_head_json ? selectedArticle.yoast_head_json.og_title : "article"}</Modal.Title>
                                                <p className='productDescriptionModal' 
                                                dangerouslySetInnerHTML= {{__html: (selectedArticle.excerpt ? selectedArticle.excerpt.rendered : "description" )
                                                    }}
                                                >
                                                </p>
                                                {selectedArticle._embedded ? selectedArticle._embedded["wp:term"][1].length > 0 &&
                                                <div className='tagDiv'>
                                                    <p className='productTagModal'>
                                                        <span className='tagSpan'>Tags: </span>{selectedArticle._embedded ? selectedArticle._embedded["wp:term"][1].map((tag)  => {
                                                            return  `${tag.name} , `
                                                        }) : "tags" } 
                                                    </p>
                                                </div>
                                               : "tag" }
                                        </Modal.Body>
                                            <Modal.Footer>
                                                <Button className='InfoButton' variant="secondary">
                                                <a href={selectedArticle.link ? selectedArticle.link: "link" } className='InfoButtonLink'>
                                                    More info
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
        )}
    </>
  );
}
