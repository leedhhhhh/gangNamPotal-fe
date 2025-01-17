import api from '@/modules/axios';

class hrService {
	static async getManageMentList(manageMentVO: any) {
		return api.get('/hr/management', { params: manageMentVO.value });
	}

	static async getTeamList() {
		return api.get('/hr/teamList');
	}

	static async getDeptList(departmentVO: any) {
		return api.get('/hr/dept', { params: departmentVO.value });
	}

	static async getAllDeptList() {
		return api.get('/hr/dept');
	}

	static async getInfo() {
		return api.get('/hr/info');
	}

	static async updateInfo(nameEn: string, phone: string, address: string) {
		return api.put('/hr/info', { nameEn: nameEn, phone: phone, address: address });
	}

	static async insertStartCommute(date: any) {
		return api.post('/commute/start', { date: date.date });
	}

	static async insertEndCommute(date: any) {
		return api.post('/commute/end', { date: date.date });
	}
}

export default hrService;
