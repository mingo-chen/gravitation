package cm.study.gravitation.orm

import java.sql.{Connection, DriverManager, ResultSet}

import scala.collection.mutable

case class DBConfig(dbUrl: String, user: String, password: String)

class DBTools(config: DBConfig) {
  classOf[com.mysql.jdbc.Driver]

  // 增
  def save(bean: ORM): Int = {
    0
  }

  // 删
  def delete(bean: ORM): Int = {
    0
  }

  // 改
  def update(bean: ORM): Int = {
    0
  }

  // 查
  def read[BEAN](sql: String, clazz: Class[BEAN]): List[BEAN] = {
    val conn = DBTools.getConn(config)
    val statement = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY)

    val rs = statement.executeQuery(sql)

    val values = new mutable.MutableList[BEAN]()

    while(rs.next()) {
      val bean = rs.getObject(1, clazz)
      values += bean
    }

    values.toList
  }

}

object DBTools {

  // 数据库连接池
  val db_pool = mutable.HashMap[DBConfig, Connection]()

  def apply(config: DBConfig): DBTools = new DBTools(config)

  def getConn(config: DBConfig): Connection = {
    if(db_pool.contains(config)) {
      val option = db_pool.get(config)
      option.get
    } else {
      val conn = DriverManager.getConnection(config.dbUrl, config.user, ""+config.password)
      db_pool.put(config, conn)
      conn
    }
  }
}
