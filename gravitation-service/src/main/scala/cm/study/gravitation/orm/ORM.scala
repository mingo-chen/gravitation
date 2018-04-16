package cm.study.gravitation.orm

import java.sql.ResultSet

import scala.collection.mutable

class ORM {
  var db: DBConfig = null
  var sql = ""
  val rt = new AnyRef

  def on(db: DBConfig): ORM = {
    this.db = db
    this
  }

  def sql(sql: String): ORM = {
    this.sql = sql
    this
  }

  def select[BEAN](func: (ResultSet) => BEAN): List[BEAN] = {
    val statement = DBTools.getConn(db).prepareCall(sql)
    val rs = statement.executeQuery()

    val values = new mutable.MutableList[BEAN]()

    while(rs.next()) {
      values += func(rs)
    }

    values.toList
  }

  def update(): Int = {
    val statement = DBTools.getConn(db).prepareStatement(sql)
//    statement.setObject()
    statement.executeUpdate()
  }

  def insert[BEAN](values: List[BEAN]): Int = {
    0
  }

  def insert[BEAN](value: BEAN): Int = {
    0
  }

  def delete(conditions: Any): Int = {
    0
  }
}

object ORM {
  val SELECT = new Select()

}