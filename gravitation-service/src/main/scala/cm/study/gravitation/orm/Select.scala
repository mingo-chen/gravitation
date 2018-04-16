package cm.study.gravitation.orm

import java.sql.ResultSet

import scala.collection.mutable

/**
  * Select dsl:
  *   Select.on(db).alias(column_name, bean_field_name).alias(column_name, bean_field_name)...
  *     .when(condition).order(order1).order(order2).limit(start, length)
  *     .to(bean)
  *
  *   Select.on(db).sql(sql).map(orm)
  */
class Select {
  var sql = ""
  var db: DBConfig = null

  def on(db: DBConfig): Select = {
    this.db = db
    this
  }

  def sql(sql: String): Select = {
    this.sql = sql
    this
  }

  def map[BEAN](func: (ResultSet) => BEAN): List[BEAN] = {
    val statement = DBTools.getConn(db).createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY)

    val rs = statement.executeQuery(sql)

    val values = new mutable.MutableList[BEAN]()

    while(rs.next()) {
      values += func(rs)
    }

    values.toList
  }

}
