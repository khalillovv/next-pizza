'use client'

import { Autocomplete, LoadScript } from '@react-google-maps/api'
import React, { useRef, useState } from 'react'
import { Input } from '../ui'

interface AddressInputProps {
	onSelect: (address: string) => void
}

const libraries = ['places']

export const AddressInput: React.FC<AddressInputProps> = ({ onSelect }) => {
	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleLoad = (autoC: google.maps.places.Autocomplete) => {
		// Определение границ Одессы после загрузки API
		const bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(46.3656, 30.61), // Юго-западная точка Одессы
			new google.maps.LatLng(46.5777, 30.8615) // Северо-восточная точка Одессы
		)

		autoC.setBounds(bounds) // Установка границ
		autoC.setComponentRestrictions({ country: 'ua' }) // Ограничение по стране

		// Принудительное ограничение поиска по Одессе
		const options = {
			types: ['geocode'], // Ограничение типов результата
			bounds: bounds, // Ограничение по границам
			strictBounds: true, // Включение строгих границ
		}

		autoC.setOptions(options)
		setAutocomplete(autoC)
	}

	const handlePlaceChanged = () => {
		if (autocomplete !== null) {
			const place = autocomplete.getPlace()

			// Попытка извлечения компонентов адреса
			const addressComponents = place.address_components || []
			const streetNumber =
				addressComponents.find(component =>
					component.types.includes('street_number')
				)?.long_name || ''

			const route =
				addressComponents.find(component => component.types.includes('route'))
					?.long_name || ''

			// В случае отсутствия номера дома, объединяем доступные данные
			const address = place.formatted_address || ''
			const detailedAddress = `${streetNumber} ${route}, ${address}`

			// Вывод в консоль для проверки
			onSelect(detailedAddress || address)
		}
	}

	return (
		<LoadScript
			googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
			libraries={libraries as any}
		>
			<Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
				<Input
					type='text'
					placeholder='Введите адрес'
					ref={inputRef}
					style={{
						width: '100%',
						height: '40px',
						padding: '10px',
						boxSizing: 'border-box',
						fontSize: '16px',
					}}
				/>
			</Autocomplete>
		</LoadScript>
	)
}
