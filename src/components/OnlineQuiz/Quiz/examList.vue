<template>
  <div>
    <v-dialog
      v-model="dialogDelete"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">
          از حذف آزمون اطمینان دارید؟
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="closeDelete"
          >
            خیر
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteItemConfirm"
          >
            بله
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpload" max-width="400px">
      <v-sheet>
        <upload-answers :exam_id="selectedExam"></upload-answers>
      </v-sheet>
    </v-dialog>
    <v-progress-linear
      color="#ffc107"
      absolute
      top
      :active="examList.loading"
      indeterminate
      rounded
      height="6"
    />
    <!--        <v-simple-table v-if="!examList.loading">-->
    <!--            <template v-slot:default>-->
    <!--                <thead>-->
    <!--                <tr>-->
    <!--                    <th class="text-right">-->
    <!--                        عنوان-->
    <!--                    </th>-->
    <!--                    <th class="text-right">-->
    <!--                        شروع-->
    <!--                    </th>-->
    <!--                    <th class="text-right">-->
    <!--                        پایان-->
    <!--                    </th>-->
    <!--                    <th class="text-right">-->
    <!--                        میزان تاخیر-->
    <!--                    </th>-->
    <!--                    <th class="text-right">-->
    <!--                        عملیات-->
    <!--                    </th>-->
    <!--                </tr>-->
    <!--                </thead>-->
    <!--                <tbody>-->
    <!--                <tr-->
    <!--                        v-for="item in examList.list"-->
    <!--                        :key="item.id"-->
    <!--                >-->
    <!--                    <td>{{ item.title }}</td>-->
    <!--                    <td>{{ item.shamsiDate('start_at').dateTime }}</td>-->
    <!--                    <td>{{ item.shamsiDate('finish_at').dateTime }}</td>-->
    <!--                    <td>{{ item.delay_time }} دقیقه</td>-->
    <!--                    <td>-->
    <!--                        <v-tooltip top v-if="false">-->
    <!--                            <template v-slot:activator="{ on, attrs }">-->
    <!--                                <v-btn-->
    <!--                                        class="mx-2"-->
    <!--                                        fab-->
    <!--                                        dark-->
    <!--                                        x-small-->
    <!--                                        color="orange"-->
    <!--                                        @click="selectExam(item)"-->
    <!--                                        v-bind="attrs"-->
    <!--                                        v-on="on"-->
    <!--                                >-->
    <!--                                    <v-icon dark>-->
    <!--                                        mdi-pencil-->
    <!--                                    </v-icon>-->
    <!--                                </v-btn>-->
    <!--                            </template>-->
    <!--                            <span>ویرایش</span>-->
    <!--                        </v-tooltip>-->
    <!--                        <v-tooltip top v-if="false">-->
    <!--                            <template v-slot:activator="{ on, attrs }">-->
    <!--                                <v-btn-->
    <!--                                        class="mx-2"-->
    <!--                                        fab-->
    <!--                                        dark-->
    <!--                                        x-small-->
    <!--                                        color="primary"-->
    <!--                                        :to="{ name: 'onlineQuiz.exams.lessons', params: { quizId: item.id}}"-->
    <!--                                        v-bind="attrs"-->
    <!--                                        v-on="on"-->
    <!--                                >-->
    <!--                                    <v-icon-->
    <!--                                            small-->
    <!--                                    >-->
    <!--                                        mdi-arrow-up-bold-box-outline-->
    <!--                                    </v-icon>-->
    <!--                                </v-btn>-->
    <!--                            </template>-->
    <!--                            <span>مشاهده تمام سوالات</span>-->
    <!--                        </v-tooltip>-->
    <!--                        <v-tooltip top>-->
    <!--                            <template v-slot:activator="{ on, attrs }">-->
    <!--                                <v-btn-->
    <!--                                        class="mx-2"-->
    <!--                                        fab-->
    <!--                                        dark-->
    <!--                                        x-small-->
    <!--                                        color="cyan"-->
    <!--                                        :to="{name: 'exam.results', params: {examId: item.id}}"-->
    <!--                                        v-bind="attrs"-->
    <!--                                        v-on="on"-->
    <!--                                >-->
    <!--                                    <v-icon-->
    <!--                                            small-->
    <!--                                    >-->
    <!--                                        mdi-clipboard-list-outline-->
    <!--                                    </v-icon>-->
    <!--                                </v-btn>-->
    <!--                            </template>-->
    <!--                            <span>مشاهده نتایج تمام شرکت کنندگان</span>-->
    <!--                        </v-tooltip>-->
    <!--                        <v-tooltip top>-->
    <!--                            <template v-slot:activator="{ on, attrs }">-->
    <!--                                <v-btn-->
    <!--                                        class="mx-2"-->
    <!--                                        fab-->
    <!--                                        dark-->
    <!--                                        x-small-->
    <!--                                        color="light-blue"-->
    <!--                                        :to="{ name: 'onlineQuiz.exams.lessons', params: { quizId: item.id}}"-->
    <!--                                        v-bind="attrs"-->
    <!--                                        v-on="on"-->
    <!--                                >-->
    <!--                                    <v-icon-->
    <!--                                            small-->
    <!--                                    >-->
    <!--                                        mdi-book-open-page-variant-->
    <!--                                    </v-icon>-->
    <!--                                </v-btn>-->
    <!--                            </template>-->
    <!--                            <span>مشاهده سوالات به تفکیک درس</span>-->
    <!--                        </v-tooltip>-->
    <!--                        <v-tooltip top>-->
    <!--                            <template v-slot:activator="{ on, attrs }">-->
    <!--                                <v-btn-->
    <!--                                        class="mx-2"-->
    <!--                                        fab-->
    <!--                                        dark-->
    <!--                                        x-small-->
    <!--                                        color="pink"-->
    <!--                                        @click="deleteItem(item)"-->
    <!--                                        v-bind="attrs"-->
    <!--                                        v-on="on"-->
    <!--                                >-->
    <!--                                    <v-icon-->
    <!--                                            small-->
    <!--                                    >-->
    <!--                                        mdi-delete-->
    <!--                                    </v-icon>-->
    <!--                                </v-btn>-->
    <!--                            </template>-->
    <!--                            <span>حذف آزمون</span>-->
    <!--                        </v-tooltip>-->

    <!--                    </td>-->
    <!--                </tr>-->
    <!--                </tbody>-->
    <!--            </template>-->
    <!--        </v-simple-table>-->
    <v-data-table
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageText: 'تعداد ردیف در هر صفحه',
        pageText: 'صفحه ' + options.page + ' از ' + Math.ceil(totalRows / options.itemsPerPage)
      }"
      :headers="headers"
      :items="rows.list"
      :options.sync="options"
      :server-items-length="totalRows"
      class="elevation-1"
      disable-sort
    >
      <template v-slot:item.start="{ item }">
        {{ item.shamsiDate('start_at').dateTime }}
      </template>
      <template v-slot:item.end="{ item }">
        {{ item.shamsiDate('finish_at').dateTime }}
      </template>
      <template v-slot:item.delay_time="{ item }">
        {{ item.delay_time }} دقیقه
      </template>
      <template v-slot:item.options="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              x-small
              color="purple"
              v-bind="attrs"
              @click="selectExam(item)"
              v-on="on"
            >
              <v-icon dark>
                mdi-pencil
              </v-icon>
            </v-btn>
          </template>
          <span>ویرایش</span>
        </v-tooltip>
        <v-tooltip
          v-if="false"
          top
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              x-small
              color="indigo"
              :to="{ name: 'onlineQuiz.exams.lessons', params: { quizId: item.id}}"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                small
              >
                mdi-arrow-up-bold-box-outline
              </v-icon>
            </v-btn>
          </template>
          <span>مشاهده تمام سوالات</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              x-small
              color="indigo"
              :to="{ name: 'onlineQuiz.exams.lessons', params: { quizId: item.id}}"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                small
              >
                mdi-book-open-page-variant
              </v-icon>
            </v-btn>
          </template>
          <span>مشاهده سوالات به تفکیک درس</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              x-small
              color="blue"
              :to="{name: 'exam.results', params: {examId: item.id}}"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                small
              >
                mdi-clipboard-list-outline
              </v-icon>
            </v-btn>
          </template>
          <span>مشاهده نتایج تمام شرکت کنندگان</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              x-small
              color="green"
              v-bind="attrs"
              @click="generateJsonFile(item, false)"
              v-on="on"
            >
              <v-icon
                small
              >
                mdi-beaker
              </v-icon>
            </v-btn>
          </template>
          <span>ساخت فایل سوالات</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              x-small
              color="yellow"
              v-bind="attrs"
              @click="generateJsonFile(item, true)"
              v-on="on"
            >
              <v-icon
                small
              >
                mdi-beaker-check
              </v-icon>
            </v-btn>
          </template>
          <span>ساخت فایل سوالات با جواب</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              x-small
              color="orange"
              v-bind="attrs"
              @click="openUploadDialog(item.id)"
              v-on="on"
            >
              <v-icon
                small
              >
                mdi-cloud-upload
              </v-icon>
            </v-btn>
          </template>
          <span>آپلود فایل سوالات و جواب ها</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="mx-2"
                fab
                dark
                x-small
                color="red"
                v-bind="attrs"
                @click="deleteItem(item)"
                v-on="on"
            >
              <v-icon
                  small
              >
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
          <span>حذف آزمون</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <div class="text-center">
      <v-btn
        elevation="2"
        @click="selectExam(null)"
      >
        ثبت آزمون جدید
      </v-btn>
    </div>
  </div>
</template>

<script>
    import Vue from 'vue'
    import {Exam, ExamList} from "@/models/Exam";
    import Toasted from 'vue-toasted';
    import API_ADDRESS from "@/api/Addresses";
    Vue.use(Toasted)
    import Axios from "axios";
    import UploadAnswers from "@/components/OnlineQuiz/Quiz/uploadAnswers";

    export default {
        name: 'ExamList',
      components: {UploadAnswers},
      data: () => ({
            dialog: false,
            dialogDelete: false,
            selectedExam: null,
            examList: new ExamList(),
            examItem: new Exam(),
            headers: [
                { text: 'عنوان', value: 'title' },
                { text: 'شروع', value: 'start' },
                { text: 'پایان', value: 'end' },
                { text: 'میزان تاخیر', value: 'delay_time' },
                { text: 'عملیات', value: 'options' }
            ],
            rows: [],
            options: {
                itemsPerPage: 15,
                page: 1
            },
            totalRows: 0,
          dialogUpload: false
        }),
        watch: {
          options: {
              handler () {
                  this.getExams()
              }
          }
        },
        mounted() {
            // this.getExams()
        },
        methods:{
            openUploadDialog (exam_id) {
              this.dialogUpload = true
              this.selectedExam = exam_id
            },
            generateJsonFile (exam, withAnswer) {
                this.examList.loading = true
                const that = this
                Axios.post(API_ADDRESS.exam.generateExamFile(exam.id, withAnswer))
                    .then(() => {
                        that.$notify({
                            group: 'notifs',
                            text: 'ساخت فایل ' + exam.title + ' با موفقیت انجام شد',
                            type: 'success',
                            duration: -1
                        })
                        this.examList.loading = false
                    })
                    .catch( () => {
                        this.examList.loading = false
                    })
            },
            editItem () {
                // this.editedIndex = this.desserts.indexOf(item)
                // this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem () {
                // this.editedIndex = this.desserts.indexOf(item)
                // this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm () {
                // this.desserts.splice(this.editedIndex, 1)
                this.closeDelete()
            },
            save () {
                this.close()
            },
            close () {
                this.dialog = false
                this.$nextTick(() => {
                    // this.editedItem = Object.assign({}, this.defaultItem)
                    // this.editedIndex = -1
                })
            },
            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    // this.editedItem = Object.assign({}, this.defaultItem)
                    // this.editedIndex = -1
                })
            },
            getExams () {
                this.examList.loading = true
                this.examList.fetch(null, API_ADDRESS.exam.base(this.options.page))
                    .then((response) => {
                        this.examList.loading = false
                        this.totalRows = response.data.meta.total
                        this.rows = new ExamList(response.data.data, {meta: response.data.meta, links: response.data.links})
                        this.examList = new ExamList(response.data.data, {meta: response.data.meta, links: response.data.links})
                    })
                    .catch(() => {
                        this.examList.loading = false
                        this.examList = new ExamList()
                    })
            },
            selectExam(item){
                this.$emit('update-exam-id', item)
            }
        }
    }
</script>

<style scoped>

</style>
