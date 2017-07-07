<?php

/**
 * Created by ATOM.
 * User: Nick Gu
 * Date: 2017/6/29
 * Time: 11:15
 */
class Cmomentinfo_Service
{

  public function __construct()
  {
      require_once('system/db/mysql_db.php');
  }

  /**
   * @param $uuid
   * @param $user_info
   * @param $create_time
   * @param float $loc
   * @param float $log
   * @param $title
   * @return bool
   */
  public function insert_cmomentinfo($params)
  {
    $insert_sql = 'insert into cMomentInfo SET uuid = "'.$params['uuid'].'",create_time = "' . $params['create_time'] . '",lat = "' . $params['lat'] . '",lng = "' . $params['lng'] . '",title = "' . $params['title'] . '"';
    $mysql_insert = new mysql_db();
    return $mysql_insert->query_db($insert_sql);
  }

  /**
   * @param $uuid
   * @return bool
   */
  public function delete_cmomentinfo_by_id_skey($params)
  {
    $delete_sql = 'delete from cMomentInfo where uuid = "'. $params['uuid'].'"';
    $mysql_delete = new mysql_db();
    return $mysql_delete->query_db($delete_sql);
  }

  /**
   * @param $uuid
   * @return array|bool
   */
  public function select_cmomentinfo($uuid)
  {
    $select_sql = 'select * from cMomentInfo where uuid = "'.$uuid'"';
    $mysql_select = new mysql_db();
    $result = $mysql_select->select_db($select_sql);
    if ($result !== false && !empty($result)) {
      $arr_result = array();
      while ($row = mysql_fetch_array($result)) {
        $arr_result['id'] = $row['id'];
        $arr_result['uuid'] = $row['uuid'];
        $arr_result['create_time'] = $row['create_time'];
        $arr_result['lat'] = $row['lat'];
        $arr_result['lng'] = $row['lng'];
        $arr_result['title'] = $row['title'];
      }
      return $arr_result;
    } else {
      return false;
    }
  }

  /**
   * @param $num 挑选出前num个（按照时间顺序）
   * @return array|bool
   */
  public function get_num_cmomentinfo($num)
  {
    $select_sql = 'select * from cMomentInfo ORDER BY `cMomentInfo`.`create_time` DESC';
    $mysql_select = new mysql_db();
    $result = $mysql_select->select_db($select_sql);
    if ($result !== false && !empty($result)) {
        $arr_result = array();
        $i = 0;
        while ($row = mysql_fetch_array($result) && $i++ < $num) {
          $arr_result['id'] = $row['id'];
          $arr_result['uuid'] = $row['uuid'];
          $arr_result['create_time'] = $row['create_time'];
          $arr_result['lat'] = $row['lat'];
          $arr_result['lng'] = $row['lng'];
          $arr_result['title'] = $row['title'];
        }
        return $arr_result;
    } else {
        return false;
    }
  }
}
