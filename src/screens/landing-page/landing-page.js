import React, {useState, useEffect} from 'react';
import Select from 'react-select'
import './landing-page.css';
import axios from 'axios';

export default function LandingPage() {

    const [ articles, setArticles ] = useState([]);
    const [ filteredArticles, setFilteredArticles ] = useState(articles);
    const [ filterTags, setFilterTags ] = useState([]);

    const Products = async () => {
        const response = await axios
        .get(
            `${process.env.REACT_APP_KITE_API}`)
            .then((result) => { 
                return result.data;
            })
            setArticles(JSON.parse(JSON.stringify(response)));
            setFilteredArticles(JSON.parse(JSON.stringify(response)));
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
        { value: 'China', label:'China'}
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
            <img className='imgBrand' src='Brand.png' alt='' />
        </div>
        <div className='products'>
        </div>
        <container>
            <div>
                <Select options={options} isMulti={true} onChange={getValues}></Select>
                <button onClick={() => clearFilter()}>
                    Limpiar filtros
                </button>
                <button className='filterButton' onClick={(e) => Filter(e)}>
                    Filtrar
                </button>
            </div>
            <h1 className='articlesTittle'>Kite Rocket Articles</h1>
            <ul className='ulGrid'>
            {
                filteredArticles !== [] && (
                filteredArticles.map((item) => {
                        return(
                            <li>
                                <img className='listedProductImg' src={item.yoast_head_json.og_image[0].url} alt='product'/>
                                <h3 className='productName'>{item.yoast_head_json.og_title}</h3>
                                <p className='productDescription' dangerouslySetInnerHTML={{__html: item.excerpt.rendered}} />
                                <a href={item.link} className='readMore'>
                                     Read more
                                </a>
                                 {item._embedded["wp:term"][1].length > 0 &&
                                <p className='productPrice'>
                                    {item._embedded["wp:term"][1].map((tag) => {
                                        return `${tag.name}, `
                                    })}
                                </p>
                                }
                                <p>
                                    <button>Add to cart</button>
                                </p>
                            </li>
                                )
                }))
            }
            </ul>
        </container>
        <footer className='landingPageFooter'>
            KiteRocket Landing Page.
        </footer>
    </div>
  )
}
