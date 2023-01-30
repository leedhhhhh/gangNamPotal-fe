<template>
	<q-drawer side="left" bordered class="app-menu-wrapper" :width="200" :breakpoint="500" show-if-above>
		<ProfileBox />
		<q-separator class="app-divider" />
		<BaseDrawer />
		<q-separator class="app-divider" />
		<div class="menu-alarm-wrapper flex justify-between items-center mt-16" @click="logout()">
			<!-- @click="handleLogout()" -->
			<div class="menu-title logout">
				<q-icon name="icon-login" class="mr-8" />
				로그아웃
			</div>
		</div>
		<div>
			<div class="button-wrapper start">
				<q-btn class="app-btn btn-basic btn-primary" flat @click="startShowValue(true)">출근</q-btn>
			</div>
			<div class="button-wrapper end">
				<q-btn class="app-btn btn-basic btn-primary" flat @click="endShowValue(true)">퇴근</q-btn>
			</div>
		</div>

		<div class="etc-wrapper">
			<div class="weather-wrraper">
				<div class="weather-datetime-wrapper">
					<p>
						{{ weatherInfo.date }} {{ weatherInfo.time }}시 기준
						<span @click="getLocation"><q-icon name="refresh" class="refresh-icon" /></span>
					</p>
				</div>

				<div class="weather-temperature-wrapper">
					<template v-if="weatherInfo.pty === '없음'">
						<template v-if="weatherInfo.sky === '맑음'">
							<template v-if="weatherInfo.isNight === false">
								<img class="weather-image" src="https://i.ibb.co/LgXkhSb/image.png" alt="image" />
							</template>
							<template v-else>
								<img class="weather-image" src="https://i.ibb.co/gvHbXf1/image.png" alt="image" />
							</template>
						</template>
						<template v-else-if="weatherInfo.sky === '구름 많음'">
							<template v-if="weatherInfo.isNight === false">
								<img class="weather-image" src="https://i.ibb.co/MgwT2nM/image.png" alt="image" />
							</template>
							<template v-else>
								<img class="weather-image" src="https://i.ibb.co/QrK4GTY/image.png" alt="image" />
							</template>
						</template>
						<template v-else-if="weatherInfo.sky === '흐림'">
							<template v-if="weatherInfo.isNight === false">
								<img class="weather-image" src="https://i.ibb.co/V2PpgYC/image.png" alt="image" />
							</template>
							<template v-else>
								<img class="weather-image" src="https://i.ibb.co/XbW2QMQ/image.png" alt="image" />
							</template>
						</template>
					</template>
					<template v-else-if="weatherInfo.pty === '비' || weatherInfo.pty === '소나기'">
						<template v-if="weatherInfo.isNight === false">
							<img class="weather-image" src="https://i.ibb.co/XXnTVcN/image.png" alt="image" />
						</template>
						<template v-else>
							<img class="weather-image" src="https://i.ibb.co/bFK4jvL/image.png" alt="image" />
						</template>
					</template>
					<template v-else-if="weatherInfo.pty === '비/눈'">
						<template v-if="weatherInfo.isNight === false">
							<img class="weather-image" src="https://i.ibb.co/nrMnnvt/image.png" alt="image" />
						</template>
						<template v-else>
							<img class="weather-image" src="https://i.ibb.co/nj0T8zS/image.png" alt="image" />
						</template>
					</template>
					<template v-else-if="weatherInfo.pty === '눈'">
						<template v-if="weatherInfo.isNight === false">
							<img class="weather-image" src="https://i.ibb.co/BNSkCWg/image.png" alt="image" />
						</template>
						<template v-else>
							<img class="weather-image" src="https://i.ibb.co/jbTk8Bq/image.png" alt="image" />
						</template>
					</template>
					<span class="weather-temperature">{{ weatherInfo.tmp }} ℃</span>
				</div>
				<div class="weather-temperature-wrapper">
					<img class="weather-image" src="https://i.ibb.co/d0zJZv8/image.png" alt="image" />
					<span class="weather-temperature">{{ weatherInfo.wsd }} m/s</span>
				</div>

				<div class="weather-addition-wrapper">
					<template v-if="weatherInfo.pop !== '0'">
						<div class="weather-addition">강수확률 : {{ weatherInfo.pop }} %</div>
					</template>

					<template v-if="weatherInfo.pcp !== '강수없음'">
						<div class="weather-addition">강수량 : {{ weatherInfo.pcp }} mm</div>
					</template>

					<template v-if="weatherInfo.sno !== '적설없음'">
						<div class="weather-addition">적설량 : {{ weatherInfo.sno }} cm</div>
					</template>
				</div>
			</div>

			<div class="addition-info-wrraper">
				<!-- <div class="addition-wrapper" >
					<q-icon name="subway" class="addition-icon"/>
					<span class="addition-content">강남역 지하철</span>
				</div> -->
				<div class="addition-wrapper" @click="setFortuneModal(true)">
					<q-icon name="auto_awesome" class="addition-icon" />
					<span class="addition-content">오늘의 운세</span>
				</div>
			</div>

			<q-dialog v-model="fortuneMessageModal">
				<div class="fortune-modal-wrapper">
					<div class="fortune-modal-close" @click="setFortuneModal(false)"><q-icon name="close" /></div>
					<div class="fortune-header-wrapper">
						<h4 class="fortune-header">오늘의 운세</h4>
						<span>믿든지 말든지~</span>
					</div>
					<div class="fortune-message-wrapper">
						<template v-if="fortuneMessage.isOpened">
							<p>{{ fortuneMessage.message }}</p>
						</template>
						<template v-else>
							<q-btn @click="showMessage"><q-icon name="touch_app" class="fortune-message-open-icon" />클릭해주세요~</q-btn>
						</template>
					</div>
				</div>
			</q-dialog>
		</div>
	</q-drawer>
</template>

<script setup lang="ts">
import Vue from 'vue';
import ProfileBox from '@/components/ProfileBox.vue';
import BaseDrawer from '@/components/BaseDrawer.vue';
import { debounce } from 'lodash-es';
import router from '@/router';
import { ref, onMounted } from 'vue';
import { useUiStore } from '@/store/ui';
import { useAuthStore } from '@/store/auth';
import etcService from '@/service/etcService';

const authStore = useAuthStore();
const uiStore = useUiStore();

const fortuneMessageModal = ref(false);

const fortuneMessage = ref({
	isOpened: false,
	message: '메시지가 없습니다',
});

const weatherInfo = ref({
	date: '0', // 기준 날짜
	time: '0', // 기준 시간
	isNight: false,
	tmp: '0', // 기온(도)
	wsd: '0', // 풍속(m/s)
	pty: '', // 강수 형태(없음, 비, 비/눈, 눈, 소나기)
	sky: '', // 하늘 상태(맑음, 구름많음, 흐림)
	pop: '', // 강수 확률(%)
	pcp: '', // 강수량(mm)
	sno: '', // 신적설량(cm)
});

const logout = debounce(async () => {
	authStore.logout();
}, 300);

const startShowValue = (flag: boolean) => {
	uiStore.start = flag;
	currentDate();
};

const endShowValue = (flag: boolean) => {
	uiStore.end = flag;
	currentDate();
};

const currentDate = () => {
	var today = new Date();

	var year = today.getFullYear();
	var month = ('0' + (today.getMonth() + 1)).slice(-2);
	var day = ('0' + today.getDate()).slice(-2);
	var hours = ('0' + today.getHours()).slice(-2);
	var minutes = ('0' + today.getMinutes()).slice(-2);
	var seconds = ('0' + today.getSeconds()).slice(-2);

	var dateString = year + '-' + month + '-' + day;
	var timeString = hours + ':' + minutes + ':' + seconds;

	uiStore.currentDate = dateString + ' ' + timeString;
	uiStore.dateString = dateString;
	uiStore.timeString = timeString;
};

const locationVO = {
	latitude: 0,
	longitude: 0,
};

const getLocation = async () => {
	if (!navigator.geolocation) {
		alert('위치 정보를 찾을 수 없습니다.');
	} else {
		navigator.geolocation.getCurrentPosition(function (location) {
			locationVO.latitude = location.coords.latitude;
			locationVO.longitude = location.coords.longitude;

			onRequest();
		});
	}
};

const onRequest = async () => {
	const list = await getWeatherInfo(locationVO);
	weatherInfo.value = list;
};

const getWeatherInfo = async (locationVO: any) => {
	await uiStore.showLoading();
	try {
		const response = await etcService.getWeatherInfo(locationVO);
		const result = response.data.data;

		return result;
	} catch (error: any) {
	} finally {
		uiStore.hideLoading();
	}
};

const setFortuneModal = (flag: boolean) => {
	fortuneMessageModal.value = flag;

	if (flag === true) {
		getFortuneMessage();
	}
};

const getFortuneMessage = async () => {
	try {
		const response = await etcService.getFortuneInfo();
		const result = response.data.data;

		fortuneMessage.value = result;
	} catch (error: any) {}
};

const showMessage = () => {
	fortuneMessage.value.isOpened = true;
};

onMounted(() => {
	getLocation();
});
</script>

<style scoped lang="scss">
.logout {
	margin-bottom: 30px;
}

.start {
	.app-btn {
		width: 100%;
		margin-bottom: 10px;
	}
}

.end {
	.app-btn {
		width: 100%;
		background: rgb(236, 7, 7);
		&:hover {
			background: rgb(194, 45, 45);
		}
	}
}

.etc-wrapper {
	padding-top: 80px;
}

.weather-wrraper {
	border: 1px solid black;
	width: 100%;
	// height: 200px;
	// background-color: rgb(48,48,48);
	border-radius: 10px;
	border: 1px solid rgb(48, 48, 48);
}

.addition-info-wrraper {
	margin-top: 20px;
	border-radius: 10px;
}

.addition-wrapper {
	margin: 15px 5px;
	display: flex;
	cursor: pointer;
}

.addition-icon {
	font-size: 1.8rem;
	padding-right: 5px;
}

.addition-content {
	padding-top: 5px;
}

.weather-wrapper p {
	margin: 0px;
	padding: 0px;
}

.weather-datetime-wrapper {
	font-size: 0.7rem;
	text-align: right;
}

.refresh-icon {
	font-size: 1rem;
	cursor: pointer;
}

.weather-image {
	width: 50px;
	padding-left: 4px;
	text-align: center;
}

.weather-temperature {
	padding-left: 10px;
	padding-top: 7px;
	text-align: center;
	width: 90px;
}

.weather-temperature-wrapper {
	width: 100%;
	font-size: 1.1rem;
	display: inline-flex;

	flex-direction: row;
	justify-content: center;
}

.weather-addition-wrapper {
	width: 100%;
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;

	padding-top: 10px;
	font-size: 0.8rem;
}
.weather-addition {
	padding-bottom: 5px;
}

.fortune-modal-wrapper {
	width: 400px;
	// height: 500px;
	border-radius: 10px;
	background-color: white;
	border: 1px solid rgb(48, 48, 48);
}

.fortune-modal-close {
	float: right;
	margin: 5px 5px;
	font-size: 1.2rem;
	width: 20px;
	cursor: pointer;
}

.fortune-header-wrapper {
	margin: 20px;
	margin-bottom: 30px;
	text-align: center;
}
.fortune-header {
	margin-bottom: 10px;
}
.fortune-message-wrapper {
	margin: 10px 30px;
	margin-bottom: 30px;
	font-size: 1.1rem;
	text-align: center;
}

.fortune-message-open-icon {
	margin-right: 10px;
}

.menu-alarm-wrapper {
	width: 100%;
	height: 40px;
	border-radius: 8px;
	padding: 8px 12px;
	cursor: pointer;
	.menu-title {
		font-weight: 500;
		font-size: $font-04;
		color: $blue-gray-10;
		line-height: $font-08;
	}
	.icon-notifications,
	.icon-login {
		color: $blue-gray-7;
		font-size: $font-08;
		vertical-align: bottom;
	}
	&:hover {
		background: $blue-gray-1;
	}
}

.announce-container {
	.app-announce-wrapper {
		width: 460px;
		background: $blue-gray-0;
		.announce-list {
			max-height: 62vh;
			overflow-y: auto;
		}
		.no-data {
			width: 100%;
			height: 62vh;
			.text {
				font-size: $font-04;
				line-height: $font-08;
				color: $blue-gray-7;
			}
		}
	}
}

@media (max-height: 1050px) {
	.announce-container {
		.app-announce-wrapper {
			.announce-list,
			.no-data {
				max-height: 52vh;
			}
		}
	}
}

@media (max-height: 720px) {
	.announce-container {
		.app-announce-wrapper {
			.announce-list,
			.no-data {
				max-height: 32vh;
			}
		}
	}
}
</style>

<style lang="scss">
.announce-container {
	max-height: none !important;
}
</style>
