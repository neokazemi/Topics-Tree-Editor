<template>
  <div class="wrapper">
    <progress-linear :active="user.loading" />
    <v-progress-linear
      v-if="percentageOfInformationCompletion > 0"
      :value="percentageOfInformationCompletion"
      absolute
      top
      color="amber"
      height="25"
    >
      <template v-slot:default="{ value }">
        <strong>{{ Math.ceil(value) }} درصد از اطلاعات تکمیل شده</strong>
      </template>
    </v-progress-linear>
    <v-row>
      <v-col cols="4">
        <div class="form-group m-form__group">
          <v-text-field
            v-model="user.first_name"
            label="نام"
          />
        </div>
      </v-col>
      <v-col cols="4">
        <div class="form-group m-form__group">
          <v-text-field
            v-model="user.last_name"
            label=" نام خانوادگی"
          />
        </div>
      </v-col>
      <v-col cols="4">
        <div class="form-group m-form__group ">
          <v-select
            v-model="user.gender.id"
            :items="genders"
            label="جنسیت"
            item-text="title"
            item-value="id"
          />
        </div>
      </v-col>
      <v-col cols="6">
        <div class="form-group m-form__group ">
          <v-autocomplete
            v-model="selectedProvince"
            label="استان"
            :items="provinces"
            item-text="title"
            item-value="id"
            no-data-text="داده ای یافت نشد"
          />
        </div>
      </v-col>
      <v-col cols="6">
        <div class="form-group m-form__group">
          <v-autocomplete
            v-model="selectedCity"
            label="شهر"
            :items="citiesForSelectedProvince"
            item-text="title"
            item-value="id"
            no-data-text="داده ای یافت نشد"
          />
        </div>
      </v-col>
      <v-col cols="6">
        <div class="form-group m-form__group ">
          <v-select
            v-model="user.major.id"
            label="رشته"
            :items="majors"
            item-text="title"
            item-value="id"
          />
        </div>
      </v-col>
      <v-col cols="6">
        <div class="form-group m-form__group ">
          <v-select
            v-model="user.grade.id"
            label="مقطع"
            :items="grades"
            item-text="title"
            item-value="id"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="user.mobile_verified_at === null">
      <v-col
        class="codeBtnPadding"
        md="12"
        sm="12"
      >
        <v-btn
          v-if="!waiting"
          color="blue"
          @click="sendCode"
        >
          دریافت کد فعالسازی
        </v-btn>
        <div v-if="waiting && showTimer">
          <div>
            <span>{{ Math.floor(((totalTime) % 3600) / 60) }}</span>
            <span>:</span>
            <span>{{ ((totalTime) % 3600) % 60 }}</span>
          </div>
          کد ارسال شده را وارد نمایید.
        </div>
      </v-col>
      <v-col
        md="12"
        sm="12"
      >
        <v-text-field
          v-model="typedCode"
          label="کد فعالسازی"
        />
      </v-col>
      <v-col
        class="codeBtnPadding"
        md="12"
        sm="12"
      >
        <v-btn
          v-if="waiting"
          color="blue"
          @click="verifyCode"
        >
          ثبت شماره موبایل
        </v-btn>
      </v-col>
    </v-row>
    <br>
    <br>
    <br>
    <v-row>
      <v-col />
      <v-col />
      <v-col cols="1">
        <v-btn
          rounded
          width="100%"
          @click="submit"
        >
          ذخیره
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
    import axios from "axios"
    import Time from "@/plugins/time"
    import ProgressLinear from "@/components/ProgressLinear"
    import {mixinAuth} from '@/mixin/Mixins'
    import API_ADDRESS from "@/api/Addresses";
    import {User} from "@/models/User";

    export default {
        name: "UserInfoForm",
        components: {ProgressLinear},
        mixins: [mixinAuth],
        props: {
            requiredItems: {
                type: Array
            },
        },
        data() {
            return {
                isCodeVerified: false,
                showTimer: false,
                mobileVerify: null,
                timer: null,
                totalTime: (3 * 60),
                minutes: null,
                seconds: null,
                resetButton: false,
                typedCode: null,
                code: null,
                waiting: false,
                userInfoInForm: {},
                submitMessage: [],
                selectedProvince: null,
                selectedCity: null,
                firstNameDisabled: false,
                lastNameDisabled: false,
                genders: [],
                majors: [],
                cities: [],
                provinces: [],
                grades: []
            }
        },
        computed: {
            percentageOfInformationCompletion () {
                return this.user.percentageOfInformationCompletion()
            },
            citiesForSelectedProvince () {
                if (this.selectedProvince) {
                    return this.cities.filter( item => item.province.id === this.selectedProvince)
                }

                return []
            }
        },
        watch: {
            selectedProvince(newVal) {
                if (newVal) {
                    let selectedProvince = this.provinces.find( item => newVal === item.id)
                    if (selectedProvince) {
                        this.user.province = selectedProvince.title
                        this.$store.commit('Auth/updateUser', new User(this.user))
                    }
                }
            },
            selectedCity(newVal) {
                if (newVal) {
                    let selectedCity = this.cities.find( item => newVal === item.id)
                    if (selectedCity) {
                        this.user.city = selectedCity.title
                        this.$store.commit('Auth/updateUser', new User(this.user))
                    }
                }
            }
        },
        mounted: function () {
            this.getUserData()
            this.$store.commit('AppLayout/updateDrawer', false)
        },
        methods: {
            getUserProvince () {
                if (!this.user.city && this.user.city.id !== null && typeof this.user.city.id !== 'undefined') {
                    return
                }
                let userCity = this.cities.find(item => item.id === this.user.city.id)
                let userProvince = null
                if (userCity) {
                    userProvince = userCity.province
                }

                return userProvince
            },
            loadUserCity () {
                if (!this.user.city) {
                    return
                }
                let userProvince = this.getUserProvince()
                this.selectedProvince = userProvince.id
                this.selectedCity = this.user.city.id
            },
            getUserData () {
                let that = this
                this.user.loading = true
                this.user.getUserData()
                    .then( (user) => {
                        this.user.loading = false
                        that.getUserFormData()
                        that.$store.commit('Auth/updateUser', user)
                        if (!that.user.needToCompleteInfo()) {
                            that.$router.push({ name: 'dashboard'})
                        } else {
                            that.$notify({
                                group: 'notifs',
                                text: 'نیاز به تکمیل اطلاعات هست.',
                                type: 'warning'
                            })
                        }
                    })
            },
            startTimer() {
                this.timer = setInterval(() => this.countdown(), 1000);
            },
            getUserFormData () {
                this.user.loading = true
                axios.get(API_ADDRESS.user.formData)
                    .then((resp) => {
                        this.genders = resp.data.data.genders
                        this.grades = resp.data.data.grades
                        this.majors = resp.data.data.majors
                        this.provinces = resp.data.data.provinces
                        this.cities = resp.data.data.cities
                        this.user.loading = false
                        // this.loadSomeData()
                        this.loadUserCity()
                    })
                    .catch(()=> {
                        this.$notify({
                            group: 'notifs',
                            title: 'توجه!',
                            text: 'مشکلی در گرفتن اطلاعات رخ داده است. لطفا دوباره امتحان کنید.',
                            type: 'error'
                        })
                        this.user.loading = false
                    }
                )
            },
            countdown: function () {
                if (this.totalTime > 0) {
                    this.totalTime--;
                } else {
                    this.waiting = false
                }
            },
            submit() {
                let that = this
                delete this.user.photo
                this.user.loading = true
                this.user.ostan_id = this.selectedProvince
                this.user.shahr_id = this.selectedCity
                this.user.update()
                    .then((response) => {
                        that.user.loading = false
                        that.$notify({
                            group: 'notifs',
                            text: 'ویرایش با موفقیت انجام شد',
                            type: 'success'
                        })
                        that.$store.commit('Auth/updateUser', response.data.data)
                        that.getUserData()
                    })
                    .catch(() => {
                        that.user.loading = false
                        that.$notify({
                            group: 'notifs',
                            title: 'توجه!',
                            text: 'مشکلی در ویرایش اطلاعات رخ داده است. لطفا دوباره امتحان کنید.',
                            type: 'error'
                        })
                    })
            },
            sendCode() {
                let that = this
                this.user.loading = true
                axios.get(API_ADDRESS.user.mobile.resend)
                    .then((resp) => {
                        that.user.loading = false
                        that.code = resp
                        that.startTimer()
                        that.waiting = true
                        that.showTimer = true
                        that.$notify({
                            group: 'notifs',
                            title: 'توجه!',
                            text: 'کد فعالسازی با موفقیت ارسال شد.',
                            type: 'success'
                        })
                    })
                    .catch(()=> {
                        that.user.loading = false
                        that.$notify({
                            group: 'notifs',
                            title: 'توجه!',
                            text: 'مشکلی در ارسال کد رخ داده است. لطفا دوباره امتحان کنید.',
                            type: 'error'
                        })
                    }
                )
            },
            verifyCode() {
                let that = this
                this.user.loading = true
                axios.post(API_ADDRESS.user.mobile.verify, { code: this.typedCode })
                    .then(() => {
                        that.user.loading = false
                        this.user.mobile_verified_at = Time.now()
                        this.isCodeVerified = true
                        this.$notify({
                            group: 'notifs',
                            title: 'توجه!',
                            text: 'شماره موبایل با موفقیت ثبت شد.',
                            type: 'success'
                        })
                        this.getUserData()
                    })
                    .catch(()=> {
                        that.user.loading = false
                    })
            },
            canSubmit() {
                let status = true;
                if (!this.isValidString(this.user.first_name)) {
                    status = false;
                    this.submitMessage.push('نام خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.last_name)) {
                    status = false;
                    this.submitMessage.push('نام خانوادگی خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.province)) {
                    status = false;
                    this.submitMessage.push('استان خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.city)) {
                    status = false;
                    this.submitMessage.push('شهر خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.gender.id)) {
                    status = false;
                    this.submitMessage.push('جنسیت خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.major.id)) {
                    status = false;
                    this.submitMessage.push('رشته خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.grade.id)) {
                    status = false;
                    this.submitMessage.push('مقطع خود را مشخص کنید.');
                }

                return status;
            },
            isValidString(string) {
                return (typeof string !== 'undefined' && string !== null && string.toString().trim().length > 0);
            }
        }
    }
</script>

<style scoped>
    .codeBtnPadding {
        padding-top: 30px;
    }

    .wrapper {
        width: 80%;
        margin: auto;
        margin-top: 30px;
        text-align: center;
    }

    .requiredItem {
        color: red;
    }
</style>
