import api from '@/modules/axios';

class etcService {
	static async getWeatherInfo(locationVO: any) {
		return api.get('/etc/weather', { params: { latitude: locationVO.latitude, longitude: locationVO.longitude } });
	}

	static async getFortuneInfo() {
		return api.get('/etc/fortune');
	}
}

export default etcService;
