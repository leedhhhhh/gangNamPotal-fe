<template>
	<div class="app-pageheader">
		<span class="main-title">인력</span>
	</div>
	<div class="filter-table-wrapper">
		<Filter :filterData="filterDataSet" @emitManageMent="getDataByFilter" />
		<Table :tableData="tableDataSet" @emitPageData="getDataByTable" />
	</div>
</template>

<script setup lang="ts">
import router from '@/router';
import { computed, onMounted, ref } from 'vue';
import Table from '@/components/Table.vue';
import Filter from '@/components/Filter.vue';
import { useUiStore } from '@/store/ui';
import hrService from '@/service/hrService';

const manageMentVO = ref({
	orderBy: '',
	pageNumber: '',
	pageSize: '10',
	searchText: '',
	selectValue: '',
	sort: '',
});

const uiStore = useUiStore();

const tableDataSet = ref({
	list: [
		{
			employeeId: '',
			nameKr: '',
			rank: '',
			affiliation: '',
			department: '',
			email: [''],
			phone: '',
		},
	], // 테이블에 들어갈 데이터 --> 더미 데이터는 여기에
	total: 0,
	isAttendance: false,
	isLoading: true,
	pageSize: '',
	columnList: [
		// 테이블 컬럼정보 정의 및 커스텀
		{ name: 'nameKr', align: 'center', label: '이름', field: 'nameKr' },
		{ name: 'rank', align: 'center', label: '직급', field: 'rank' },
		{ name: 'affiliation', align: 'center', label: '소속', field: 'affiliation' },
		{ name: 'department', align: 'center', label: '부서', field: 'department' },
		{ name: 'email', align: 'left', label: '이메일', field: 'email' },
		{ name: 'phone', align: 'left', label: '연락처', field: 'phone' },
	],
	sortKey: {
		nameKr: 'nameKr',
		rank: 'rank',
		joinDt: 'joinDt',
		stat: 'stat',
	},
});

const filterDataSet = ref({
	isManagement: true,
	isAttendance: false,

	titleList: [
		{
			name: 'nameKr',
			label: '이름',
		},
		{
			name: 'rank',
			label: '직급',
		},
		{
			name: 'affiliation',
			label: '소속',
		},
		{
			name: 'email',
			label: '이메일',
		},
		{
			name: 'phone',
			label: '전화번호',
		},
	],
});

const getDataByFilter = (emitData: any) => {
	manageMentVO.value.selectValue = emitData.selectValue;
	manageMentVO.value.searchText = emitData.searchText;

	onRequest();
};

const getDataByTable = (emitData: any) => {
	manageMentVO.value.orderBy = emitData.orderBy;
	manageMentVO.value.pageNumber = emitData.pageNumber;
	manageMentVO.value.pageSize = emitData.pageSize;
	manageMentVO.value.sort = emitData.sort;
	tableDataSet.value.pageSize = emitData.pageSize;

	onRequest();

	// onRequest2();
};

const onRequest = async () => {
	const list = await getManageMentList(manageMentVO);

	console.log(list);

	tableDataSet.value.list = list.hrInfoDataLists;
	tableDataSet.value.total = list.totalCount;

	// tableDataSet.value.list.email = list.email.split(',');
};

const getManageMentList = async (manageMentVO: any) => {
	await uiStore.showLoading();
	try {
		const response = await hrService.getManageMentList(manageMentVO);
		const result = response.data.data;

		return result;
	} catch (error: any) {
	} finally {
		uiStore.hideLoading();
	}
};
</script>

<style scoped lang="scss"></style>
