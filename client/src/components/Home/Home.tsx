import React from 'react';
import Router from '../Router/Router';
import Button from '../Button/Button';
import styles from './Home.module.scss'
import image from './warship-icon.svg';


class Home extends React.Component {

	render() {
		return <div className={styles.layout}>
				
			<div className={styles.banner}>
				<div>
					<img src={image} />
				</div>
				Морской бой
			</div>


			<div className={styles.buttons}>

				<Button>
					ВКЛЮЧИТЬ ЗВУК
				</Button>

				<Button onClick={() => Router.go('/placeShips')}>
					ИГРАТЬ С ДРУГОМ
				</Button>

				<Button onClick={() => Router.go('/placeShips')}>
					ИГРАТЬ СО СЛУЧАЙНЫМ
				</Button>
			</div>

		</div>
	}


}

export default Home;