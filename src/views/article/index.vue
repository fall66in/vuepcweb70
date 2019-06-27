<template>
  <div>
      <el-card class="box-card  header">
        <div slot="header" class="clearfix" >
            <span>数据筛选</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <el-form ref="form" :model="filterParams" label-width="80px">
          <el-form-item label="文章状态:">
            <el-radio-group v-model="filterParams.status">
              <el-radio label="">全部</el-radio>
              <!-- 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部 -->
              <el-radio
              v-for="(item,index) in statTypes"
              :key="item.label"
              :label="index"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表:">
            <!-- 为el-select设置clearable属性，则可将选择器清空。需要注意的是，clearable属性仅适用于单选 -->
            <el-select v-model="filterParams.channel_id" clearable placeholder="请选择">
            <el-option
            v-for="item in channels"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="活动时间:">
            <el-date-picker
              v-model="filterParams.begin_pubdate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">筛选</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>文章列表</span>
        </div>
        <!--
        table表格不需要我们手动v-for遍历
        只需要将数组数据交给table表格的data属性
        然后配置el-table-colum表格列组件

        label 列头标题
        prop 遍历项中的数据字段
        width 列的宽度

        表格默认把数据当做文本去输出
        如果需要其他数据格式，可以自定义表格列
        -->
                <el-table
            :data="articles"
            style="width: 100%"
            class="table"
            v-loading="articleLoading">
            <el-table-column
                label="封面"
                width="180">
                <!--
                   template 中的内容就是自定义表格列内容
                   如果需要在template中访问遍历项数据，则需要给template配置slot-scope
                   slot-scope 属性名是固定的
                   scope 值是自己随便起的名字
                   结果就是我们可以通过scope.row访问到当前遍历项对象，就好比我们自己遍历的item一样
                 -->
                <template slot-scope="scope">
                  <!-- 这是只有一张图片 -->
                  <!-- <img :src="scope.row.cover.images[0]"> -->

                  <!-- 这是有多张图片 -->
                  <img
                  width="20"
                  v-for="item in scope.row.cover.images"
                  :key="item"
                  :src="item">
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题"
                width="180">
            </el-table-column>
            <el-table-column
                label="状态"
                width="180">
                <template slot-scope="scope">
                   <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="pubdate"
                label="发布时间"
                width="180">
            </el-table-column>
            <el-table-column
                label="操作">
                <template>
                  <el-button size="mini" type="primary" plain>修改</el-button>
                  <el-button size="mini" type="danger" plain>删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <!--
            数据分页
            page-size 配置每页大小，默认是10
            total 用来配置总记录数
            分页组件会根据每页大小和总记录数进行分页
            current-change:currentPage 改变时会触发
            -->
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="totalCount"
              :disabled="articleLoading"
              @current-change="handleCurrentChange">
            </el-pagination>
      </el-card>

  </div>
</template>

<script>
// import { getUser } from '@/utils/auth'
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      pageSize: 10, // pageSize每页有十条
      totalCount: 0, // 总数据量
      page: 1, // 当前页码
      articleLoading: false,
      filterParams: {
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      channels: [] // 所有频道
    }
  },
  created () {
    this.loadArticles() // 获取文章
    this.loadChannels() // 获取频道
  },
  methods: {
    async loadChannels () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        // console.log(data)
        this.channels = data.channels
      } catch (err) {
        console.log(err)
        this.$message.err('获取频道数据失败')
      }
    },
    async loadArticles () {
      // 请求开始，加载loading
      this.articleLoading = true
      // const token = getUser().token
      // 除了登录相关接口之后，其他接口都必须在请求头中通过Authorization 字段提供用户token
      // 当我们登录成功，服务端会生成一个token令牌，放到用户信息中
      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page, // 页码
          per_page: this.pageSize // 每页大小
        }
      })
      // console.log(data) // 返回401，token过期或未传
      this.articles = data.results
      this.totalCount = data.total_count

      // 请求结束，停止loading
      this.articleLoading = false
    },
    // 回调函数当前页
    handleCurrentChange (page) {
      console.log(page)
      // 将数据中的页面修改为当前最新改变的数据页码
      this.page = page
      // 页码改变，页面加载当前文字列表
      this.loadArticles()
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 20px;
}
.table {
  margin-bottom: 20px;
}
</style>
