<?php

/**
 * Created by ATOM.
 * User: Nick Gu
 * Date: 2017/7/2
 * Time: 12:32
 */
class Moment
{

  public function __construct()
  {
    require_once('application/services/qcloud/minaauth/Cmomentinfo_Service.php');
    require_once('system/return_code.php');
    require_once('system/log/log.php');
  }

  /**
   * @param $loc
   * @param $lng
   * @param $title
   * 描述：增加动态信息到数据库中
   */
  public function create_moment($loc,$lng,$title)
  {
    $uuid = md5((time()-mt_rand(1, 10000)) . mt_rand(1, 1000000));
    $create_time = date('Y-m-d H:i:s', time());

    $cmomentinfo_service = new Cmomentinfo_Service();
    $params = array(
      "uuid"=>$uuid,
      "lat"=>$loc,
      "lng"=>$lng,
      "title"=>$title,
      "create_time"=>$create_time,
    );

    if($cmomentinfo_service->insert_cmomentinfo($params))
    {
      $ret['returnCode'] = return_code::MA_OK;
      $ret['returnMessage'] = 'CREATE_MOMENT_SUCCESS';
      $ret['returnData'] = '';
    } else {
      $ret['returnCode'] = return_code::MA_INIT_APPINFO_ERR;
      $ret['returnMessage'] = 'CREATE_MOMENT_FAIL';
      $ret['returnData'] = '';
    }

    return $ret;
  }

  /**
   * @param $uuid
   * 描述：在数据库中利用uuid查询相关动态信息
   */
  public function get_moment($uuid)
  {
    $cmomentinfo_service = new Cmomentinfo_Service();
    $cmomentinfo_data = $cmomentinfo_service->select_cmomentinfo($uuid);
    if (empty($cmomentinfo_data) || ($cappinfo_data == false)) {
      $ret['returnCode'] = return_code::MA_NO_APPID;
      $ret['returnMessage'] = 'NO_MOMENT_UUID';
      $ret['returnData'] = '';
    } else {
      $ret['returnCode'] = return_code::MA_OK;
      $ret['returnMessage'] = 'GET_MOMENT_SUCCESS';
      $ret['returnData'] = $cmomentinfo_data;
    }

    return $ret;
  }
}
