<template>
	<div class="app-pageheader">
		<q-btn class="app-btn btn-basic btn-ghost-black btn-only-icon btn-prev" flat></q-btn>
		<span class="main-title">마이 페이지</span>
		<q-space />
		<div class="button-wrapper" v-if="buttonValue">
			<q-btn class="app-btn btn-basic btn-primary" flat @click="showButton(false)">수정</q-btn>
		</div>
		<div v-else>
			<div class="button-wrapper">
				<q-btn class="app-btn btn-basic btn-primary btn-cancle" flat @click="showButton(true)">취소</q-btn>
				<q-btn class="app-btn btn-basic btn-primary" flat @click="onRequest()">저장</q-btn>
			</div>
		</div>
	</div>
	<div class="employee-info-container">
		<div class="personal-info-container flex no-wrap">
			<!--기본 정보-->
			<div class="detail-info-container detail-basic">
				<div class="app-detail-info-wrapper info-height">
					<div class="detail-info-header">
						<span class="title">기본 정보</span>
					</div>
					<div class="info-content-wrapper">
						<div class="info-profile-wrapper">
							<div class="info-profile-section">
								<template v-if="1 == 1">
									<img :src="employeeData.profileImg" alt="" />
								</template>
								<template v-else>
									<img src="@/assets/images/teemo.png" />
								</template>
							</div>
						</div>
						<div class="info-content-section">
							<div class="row-info">
								<div class="info-title">이름<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-input class="app-input" outlined v-model="employeeData.nameKr" readonly />
									<div class="hint-text-wrapper">
										<div class="hint-text">
											<!-- checkErrorNameKr -->
										</div>
										<div class="num-text"></div>
									</div>
								</div>
							</div>
							<div class="row-info">
								<div class="info-title">영어 이름<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-input class="app-input" outlined v-model="employeeData.nameEn" />
									<div class="hint-text-wrapper">
										<div class="hint-text">
											<!-- checkErrorNameEn -->
										</div>
										<div class="num-text"></div>
									</div>
								</div>
							</div>
							<div class="row-info info-birth">
								<div class="info-title">생년월일<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-input class="app-input" outlined v-model="employeeData.birthday" readonly />
									<div class="hint-text-wrapper">
										<div class="hint-text"></div>
										<div class="num-text"></div>
									</div>
								</div>
								<q-btn-toggle
									v-model="employeeData.gender"
									class="app-btn btn-small-toggle-switch"
									no-caps
									unelevated
									:options="[
										{ label: '남', value: '남자' },
										{ label: '여', value: '여자' },
									]"
								/>
							</div>
							<div class="row-info">
								<div class="info-title">연락처<span class="aster">*</span></div>
								<div class="app-input-wrapper">
									<q-input class="app-input" outlined v-model="employeeData.phone" mask="###-####-####" />
									<div class="hint-text-wrapper">
										<div class="hint-text">
											<!-- checkErrorPhone -->
										</div>
										<div class="num-text"></div>
									</div>
								</div>
							</div>
							<div class="row-info address-info">
								<div class="info-title">주소<span class="aster">*</span></div>
								<div class="app-input-wrapper">
									<q-input class="app-input input-textarea" type="textarea" outlined v-model="employeeData.address" />
									<div class="hint-text-wrapper">
										<div class="hint-text"></div>
										<div class="num-text"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--입사 정보-->
			<div class="detail-info-container detail-company">
				<div class="app-detail-info-wrapper">
					<div class="detail-info-header">
						<span class="title">입사 정보</span>
					</div>

					<div class="info-content-wrapper">
						<div class="info-content-section">
							<div class="row-info">
								<div class="info-title">상태</div>
								<template v-for="(stat, index) of selectOption.stat" :key="index">
									<q-radio
										class="app-btn btn-radio read-only"
										v-model="sampleSelectData.stat"
										:label="stat.label"
										:val="stat.label"
										disable
									/>
								</template>
							</div>

							<div class="row-info info-order">
								<div class="info-title">입사일<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-input class="app-input" outlined v-model="employeeData.joinDate" readonly />
									<div class="hint-text-wrapper">
										<div class="hint-text"></div>
										<div class="num-text"></div>
									</div>
								</div>

								<div class="info-title">사번<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-input class="app-input" outlined v-model="employeeData.employeeNo" readonly />
									<div>
										<div class="hint-text">
											<!-- checkErrorEmployeeNo -->
										</div>
										<div class="num-text"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="app-detail-info-wrapper">
					<div class="detail-info-header">
						<span class="title">인사 배치</span>
					</div>
					<div class="info-content-wrapper">
						<div class="info-content-section">
							<div class="row-info">
								<div class="info-title">권한</div>
								<template v-for="(permission, index) of selectOption.permission" :key="index">
									<q-radio
										class="app-btn btn-radio read-only"
										v-model="permission.id"
										:label="permission.label"
										:val="employeeData.role"
										disable
									/>
								</template>
							</div>

							<div class="row-info info-arrangement">
								<div class="info-title">소속<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-select
										class="app-input input-select"
										popup-content-class="select-popup"
										outlined
										v-model="employeeData.affiliation"
										:options="selectOption.affi"
										readonly
									>
									</q-select>
									<div class="hint-text-wrapper">
										<div class="hint-text"></div>
									</div>
								</div>

								<div class="info-title">부서<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-select
										class="app-input input-select"
										popup-content-class="select-popup"
										outlined
										v-model="employeeData.department"
										:options="selectOption.affi[0].dept"
										readonly
									>
									</q-select>
									<div class="hint-text-wrapper">
										<div class="hint-text"></div>
									</div>
								</div>

								<div class="info-title">직급<span class="aster" v-if="1 !== 1">*</span></div>
								<div class="app-input-wrapper">
									<q-select
										class="app-input input-select"
										popup-content-class="select-popup"
										outlined
										v-model="employeeData.rank"
										:options="selectOption.rank"
										readonly
									>
									</q-select>
									<div class="hint-text-wrapper">
										<div class="hint-text"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="app-detail-info-wrapper">
					<div class="detail-info-header">
						<span class="title">계정 정보</span>
					</div>
					<div class="info-content-wrapper">
						<div class="info-content-section">
							<div class="row-info info-email">
								<div class="info-title">이메일<span class="aster" v-if="1 !== 1">*</span></div>

								<div class="email-wrapper">
									<!-- <div class="app-input-wrapper"> -->
									<div class="email-info" v-for="(email, i) in employeeData.email" :key="i">{{ email }}</div>
									<!-- <div class="hint-text-wrapper">
											<div class="hint-text"></div>
										</div> -->
									<!-- </div> -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, computed, onMounted } from 'vue';
import { useUiStore } from '@/store/ui';
import hrService from '@/service/hrService';

const uiStore = useUiStore();
const buttonValue = ref(true);

const showButton = (flag: boolean) => {
	buttonValue.value = flag;
};

const employeeData = ref({
	address: '',
	affiliation: '',
	birthday: '',
	department: '',
	email: [''],
	employeeId: 0,
	employeeNo: 0,
	gen: 0,
	gender: '',
	joinDate: '',
	nameEn: '',
	nameKr: '',
	phone: '',
	profileImg: '',
	rank: '',
	role: '',
});

const sampleData = ref({
	nameKr: '박민호',
	nameEn: 'Park minho',
	birthday: '1993.11.06',
	gender: 'male',
	phone: '01051882240',
	address: '서울시 서대문구 연희로 41나길 38',
	stat: '재직',
	joinDate: '2022.11.16',
	employeeNo: '153',
	permission: {
		permissionId: '1',
		permissionName: '일반사용자',
	},
	dept: {
		deptId: '1',
		deptName: '개발',
		affi: {
			affiId: '1',
			affiName: '개발',
		},
	},
	rank: {
		rankId: '3',
		rankName: '선임',
	},
	email: 'minho.park@twolinecode.com',
	password: 'tlc123',
	passwordRepeat: 'tlc123',
	photoPath: '@/assets/images/teemo.png',
});

//  "address": "string", 1
//     "affiliation": "QA",
//     "birthday": "string", 1
//     "department": "BX",
//     "email": "string",
//     "employeeId": 0,
//     "employeeNo": 0,
//     "gen": 0,
//     "gender": "string", 1
//     "joinDate": "string",
//     "nameEn": "string", 1
//     "nameKr": "string", 1
//     "phone": "string", 1
//     "profileImg": "string",
//     "rank": "과장",
//     "role": "string"

const onMypage = async () => {
	const info = await getInfo();
	employeeData.value = info;
	employeeData.value.email = info.email.split(',');
};

const getInfo = async () => {
	await uiStore.showLoading();
	try {
		// 토큰 전달
		const response = await hrService.getInfo();
		const result = response.data.data;

		return result;
	} catch (error: any) {
	} finally {
		uiStore.hideLoading();
	}
};

const selectOption = ref({
	stat: [
		{ label: '재직', id: 1 },
		{ label: '퇴직', id: 2 },
	],
	permission: [
		{ label: '일반사용자', id: 'USER' },
		{ label: '관리자', id: 'ADMIN' },
	],
	affi: [
		{ label: '개발', id: 1, dept: ['개발', '퍼블리셔'] },
		{ label: 'QA', id: 2 },
		{ label: '경영지원', id: 3 },
		{ label: '디자인', id: 4 },
		{ label: '마케팅', id: 5 },
	],
	rank: [
		{ label: '선임', id: 1 },
		{ label: '수석', id: 2 },
	],
});

const sampleSelectData = ref({
	stat: '재직',
	permission: '일반사용자',
	dept: '개발',
	affi: '개발',
	rank: '선임',
});

const onRequest = async () => {
	const info = await updateInfo(employeeData.value.nameEn, employeeData.value.phone, employeeData.value.address);
};

const updateInfo = async (nameEn: string, phone: string, address: string) => {
	await uiStore.showLoading();
	try {
		const response = await hrService.updateInfo(nameEn, phone, address);
		const result = response.status;

		return result;
	} catch (error: any) {
	} finally {
		uiStore.hideLoading();
	}

	//수정하면 리프레쉬
};

onMounted(() => {
	onMypage();
});
</script>

<style scoped lang="scss">
.email-wrapper {
	width: 100%;
	margin-top: 8px;
	display: flex;
	flex-direction: column;
	justify-content: left;
	align-items: left;
}

.email-info {
	margin-bottom: 10px;
	color: #65728a;
	font-size: 1rem;
}

.btn-cancle {
	background: gray;
}
.employee-info-container {
	min-height: calc(100% - 72px);
	padding: 28px;
	background: $blue-gray-1;
	//border: 1px solid $blue-gray-3;
	//border-radius: 0 0 20px 0;
}
.personal-info-container {
	display: flex;
	margin-bottom: 20px;
	.detail-info-container {
		&.detail-basic {
			min-width: 478px;
			width: 42.23%;
			.info-content-wrapper {
				.info-profile-wrapper {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					padding: 20px 0 44px;
					.info-profile-section {
						width: 150px;
						height: 150px;
						border-radius: 50%;
						overflow: hidden;
						img {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}
					.btn-upload {
						margin-top: 16px;
					}
				}
				.info-content-section {
					.row-info + .row-info {
						margin-top: 8px;
					}
				}
			}
		}
		.info-content-section {
			.row-info {
				display: flex;
				.info-title {
					flex-shrink: 0;
					width: 54px;
					margin-top: 12px;
					font-size: $font-02;
					line-height: $font-06;
					font-weight: 500;
					color: $blue-gray-10;
					.aster {
						display: inline-block;
						margin-left: 2px;
						font-size: $font-02;
						line-height: $font-06;
						font-weight: 500;
						color: #ff6161;
					}
				}
				.info-title + * {
					margin-left: 12px;
				}
				.app-input-wrapper {
					width: 100%;
					.app-input {
						width: 100%;
						margin-top: 0;
					}
					.app-input-picker {
						width: 100%;
						margin-top: 0;
					}
					.input-textarea {
						height: 236px;
					}
				}
				&.info-birth {
					.app-input-wrapper {
						.app-input-picker {
							width: calc(100% - 12px);
						}
					}
				}
			}
		}
		&.detail-company {
			min-width: 654px;
			width: 57.77%;
			margin-left: 20px;
			.app-detail-info-wrapper + .app-detail-info-wrapper {
				margin-top: 20px;
			}
			.app-detail-info-wrapper {
				.info-content-section {
					.row-info + .row-info {
						margin-top: 20px;
					}
					.row-info {
						.info-title {
							width: 40px;
						}
						.btn-radio {
							padding: 10px 0;
						}
						.btn-radio + .btn-radio {
							margin-left: 20px;
						}
						.app-input-wrapper + .info-title {
							margin-left: 20px;
						}
						&.info-order {
							margin-top: 28px;
							> .app-input-wrapper:nth-child(2) {
								min-width: 264px;
								width: 55.7%;
								&.one-input {
									width: calc(55.7% - 72px);
								}
							}
							> .app-input-wrapper:nth-child(4) {
								min-width: 210px;
								width: 44.3%;
							}
						}
						&.info-arrangement {
							.info-title {
								width: 30px;
							}
							margin-top: 28px;
							.app-input-wrapper {
								min-width: 144px;
								.hint-text-wrapper {
									.hint-text {
										min-width: auto;
									}
								}
							}
						}
						&.info-email {
							.info-title {
								width: 74px;
							}
							.append-address {
								margin-left: 12px;
								margin-top: 12px;
								font-size: $font-04;
								line-height: $font-08;
								font-weight: 500;
								color: $blue-gray-9;
							}
							.btn-duplication-check {
								flex-shrink: 0;
								flex-grow: 0;
								width: auto;
								margin-left: 39px;
							}
						}
					}
					.info-arrangement + .row-info {
						margin-top: 8px;
					}
					.info-order + .info-order {
						margin-top: 8px;
					}
					.info-email + .info-email {
						margin-top: 8px;
					}
					.info-sign {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.app-input-wrapper {
							width: 100%;
							.input-file {
								width: 100%;
							}
						}
						.sign-section {
							width: 120px;
							height: 96px;
							img {
								width: 100%;
								height: 100%;
								object-fit: cover;
							}
						}
					}
				}
			}
		}
	}
}
</style>
